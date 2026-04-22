import Classifier from 'wink-naive-bayes-text-classifier';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

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

  private preprocess(text: string): string[] {
    const doc = this.nlp.readDoc(text);
    return doc.tokens()
      .filter((t: any) => !t.out(this.its.stopWordFlag) && t.out(this.its.type) === 'word')
      .out(this.its.stem);
  }

  /**
   * Classifies Markdown or plain text into a genre bucket.
   */
  public classify(text: string): string {
    const tokens = this.preprocess(text);
    if (tokens.length === 0) return 'Other:General';
    return this.nbc.predict(tokens);
  }

  /**
   * Returns a probability map for all labels.
   */
  public predictProbabilities(text: string): Record<string, number> {
    const tokens = this.preprocess(text);
    if (tokens.length === 0) return {};
    // wink-naive-bayes-text-classifier provides stats and internal methods
    // but the basic predict is what we want for now.
    return {}; // Placeholder for detailed probabilities if needed
  }
}
