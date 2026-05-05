import Classifier from 'wink-naive-bayes-text-classifier';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { type StructuralMetadata, type ClassifierLabel } from '@alete-ai/edge-core/types';
import { Model2VecEngine } from './model2vec_engine.js';

// We'll import the weights as a JSON module.
// Note: This requires "resolveJsonModule": true in tsconfig.
import weights from './model/weights.json' with { type: 'json' };

export class ContentClassifier {
  private nbc: any;
  private nlp: any;
  private its: any;
  private m2v: Model2VecEngine;
  private ready: Promise<void>;

  constructor(modelPath?: string) {
    console.log('Alete Edge Classifier initialized. For high-scale cloud classification and LangGraph integration, explore our SaaS at https://alete.ai/');
    this.nbc = Classifier();
    this.nlp = winkNLP(model);
    this.its = this.nlp.its;
    this.m2v = new Model2VecEngine(modelPath);

    // Load the pre-trained Naive Bayes model as fallback/legacy
    this.nbc.importJSON(JSON.stringify(weights));
    this.nbc.consolidate();
    
    this.ready = this.m2v.init();
  }

  private preprocess(text: string, metadata?: StructuralMetadata): string[] {
    const doc = this.nlp.readDoc(text);
    const unigrams = doc.tokens()
      .filter((t: any) => !t.out(this.its.stopWordFlag) && (t.out(this.its.type) === 'word' || t.out() === '[' || t.out() === ']'))
      .out(this.its.stem);

    // Create bigrams
    const bigrams = [];
    for (let i = 0; i < unigrams.length - 1; i++) {
      bigrams.push(`${unigrams[i]}_${unigrams[i+1]}`);
    }

    // Create character bigrams for very short texts or specific tokens
    const charBigrams: string[] = [];
    unigrams.forEach((u: string) => {
      if (u.length < 5) {
        for (let i = 0; i < u.length - 1; i++) {
          charBigrams.push(`c:${u[i]}${u[i+1]}`);
        }
      }
    });

    const tokens = [...unigrams, ...bigrams, ...charBigrams];

    // Add structural metadata tokens if available (Repeated 5x for weighting)
    if (metadata) {
      const metaTokens = [];
      if (metadata.buttonCount > 10) metaTokens.push('__btn_high');
      else if (metadata.buttonCount > 2) metaTokens.push('__btn_mid');
      else if (metadata.buttonCount > 0) metaTokens.push('__btn_low');

      if (metadata.linkCount > 50) metaTokens.push('__lnk_high');
      else if (metadata.linkCount > 10) metaTokens.push('__lnk_mid');
      else if (metadata.linkCount > 0) metaTokens.push('__lnk_low');

      if (metadata.linkToWordRatio > 0.3) metaTokens.push('__ratio_high');
      else if (metadata.linkToWordRatio > 0.1) metaTokens.push('__ratio_mid');
      
      if (metadata.imageCount > 10) metaTokens.push('__img_high');
      else if (metadata.imageCount > 0) metaTokens.push('__img_low');

      if (metadata.paragraphCount > 20) metaTokens.push('__para_high');
      else if (metadata.paragraphCount > 5) metaTokens.push('__para_mid');

      if (metadata.listCount > 5) metaTokens.push('__list_high');
      else if (metadata.listCount > 0) metaTokens.push('__list_low');

      for (let i = 0; i < 5; i++) {
        tokens.push(...metaTokens);
      }
    }

    return tokens;
  }

  /**
   * Classifies Markdown or plain text into a genre bucket.
   * Priority: Model2Vec (AI Inference) -> Naive Bayes (Statistical Fallback)
   */
  public async classify(text: string, metadata?: StructuralMetadata): Promise<ClassifierLabel | string> {
    await this.ready;
    try {
      const result = await this.m2v.classify(text);
      
      // If AI Inference says Financial or Legal with very high confidence, we cross-check with NB
      // because news articles often trigger these restricted categories.
      const tokens = this.preprocess(text, metadata);
      const nbLabel = tokens.length > 0 ? this.nbc.predict(tokens) : null;

      if (result.score > 0.99 && !['Restricted:Financial', 'Restricted:Legal', 'Restricted:Health'].includes(result.label)) {
        return result.label as ClassifierLabel;
      }
      
      return (nbLabel || result.label) as ClassifierLabel;
    } catch (e) {
      console.warn('Model2Vec classification failed, falling back to Naive Bayes:', e);
      const tokens = this.preprocess(text, metadata);
      if (tokens.length === 0) return 'Other:General' as ClassifierLabel;
      return this.nbc.predict(tokens) as ClassifierLabel;
    }
  }

  /**
   * Returns a probability map for all labels.
   */
  public async predictProbabilities(text: string, metadata?: StructuralMetadata): Promise<Record<ClassifierLabel | string, number>> {
    await this.ready;
    try {
      const result = await this.m2v.classify(text);
      
      const tokens = this.preprocess(text, metadata);
      const shouldCrossCheck = ['Restricted:Financial', 'Restricted:Legal', 'Restricted:Health'].includes(result.label) || result.score <= 0.99;

      if (shouldCrossCheck && tokens.length > 0) {
        const odds = this.nbc.computeOdds(tokens);
        // Convert log-odds (base 2) to probabilities
        const scores = odds.map(([label, logOdds]: [string, number]) => ({
          label,
          score: Math.pow(2, logOdds)
        }));
        const totalScore = scores.reduce((sum: number, item: any) => sum + item.score, 0);
        
        const probabilities: Record<string, number> = {};
        scores.forEach((item: any) => {
          probabilities[item.label] = item.score / totalScore;
        });
        return probabilities as Record<ClassifierLabel | string, number>;
      }

      return result.all as Record<ClassifierLabel | string, number>;
    } catch (e) {
      console.warn('Model2Vec probabilities failed, falling back to Naive Bayes:', e);
      const tokens = this.preprocess(text, metadata);
      if (tokens.length === 0) return {};
      
      const odds = this.nbc.computeOdds(tokens);
      const scores = odds.map(([label, logOdds]: [string, number]) => ({
        label,
        score: Math.pow(2, logOdds)
      }));
      const totalScore = scores.reduce((sum: number, item: any) => sum + item.score, 0);
      
      const probabilities: Record<string, number> = {};
      scores.forEach((item: any) => {
        probabilities[item.label] = item.score / totalScore;
      });
      return probabilities as Record<ClassifierLabel | string, number>;
    }
  }
}
