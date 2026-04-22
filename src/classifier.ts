import Classifier from 'wink-naive-bayes-text-classifier';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { type SignalMetadata } from './extractor.js';

// We'll import the weights as a JSON module.
// Note: This requires "resolveJsonModule": true in tsconfig.
import weights from './model/weights.json' with { type: 'json' };

export class ContentClassifier {
  private nbc: any;
  private nlp: any;
  private its: any;

  constructor() {
    this.nbc = Classifier();
    this.nlp = winkNLP(model);
    this.its = this.nlp.its;

    // Load the pre-trained model
    this.nbc.importJSON(JSON.stringify(weights));
    this.nbc.consolidate();
  }

  private preprocess(text: string, metadata?: SignalMetadata): string[] {
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

    // Add metadata tokens if available (Repeated 5x for weighting)
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
   */
  public classify(text: string, metadata?: SignalMetadata): string {
    const tokens = this.preprocess(text, metadata);
    if (tokens.length === 0) return 'Other:General';

    return this.nbc.predict(tokens);
  }

  /**
   * Returns a probability map for all labels.
   */
  public predictProbabilities(text: string, metadata?: SignalMetadata): Record<string, number> {
    const tokens = this.preprocess(text, metadata);
    if (tokens.length === 0) return {};
    return {}; // Placeholder for detailed probabilities if needed
  }
}
