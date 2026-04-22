import json
import os
import random

def augment_data():
    input_path = os.path.join(os.path.dirname(__file__), "real_web_data.json")
    output_path = os.path.join(os.path.dirname(__file__), "augmented_web_data.json")
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, "r", encoding="utf-8") as f:
        real_data = json.load(f)

    augmented_data = []

    for item in real_data:
        # Original
        augmented_data.append(item)
        
        text = item.get("text", "")
        metadata = item.get("metadata", {})
        label = item.get("label", "Other:General")
        
        # Split text into lines/sentences
        lines = text.split('\n')
        
        for i in range(5): # Create 5 variations
            # 1. Shuffle sentences (if multi-line)
            new_lines = lines[:]
            if len(new_lines) > 2:
                random.shuffle(new_lines)
            
            # 2. Random word drop (10%)
            processed_lines = []
            for line in new_lines:
                words = line.split()
                if len(words) > 5:
                    words = [w for w in words if random.random() > 0.1]
                processed_lines.append(" ".join(words))
            
            new_text = "\n".join(processed_lines)
            
            # 3. Perturb metadata
            new_metadata = metadata.copy()
            if "buttonCount" in new_metadata:
                new_metadata["buttonCount"] = max(0, new_metadata["buttonCount"] + random.randint(-1, 1))
            if "linkCount" in new_metadata:
                new_metadata["linkCount"] = max(0, new_metadata["linkCount"] + random.randint(-5, 5))
            
            augmented_data.append({
                "text": new_text,
                "label": label,
                "metadata": new_metadata,
                "source": "augmented_web"
            })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(augmented_data, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(augmented_data)} augmented samples to {output_path}")

if __name__ == "__main__":
    augment_data()
