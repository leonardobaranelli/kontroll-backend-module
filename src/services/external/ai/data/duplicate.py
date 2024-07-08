import json

# Load existing training examples
with open("training_validation.json", "r") as file:
    training_examples = json.load(file)

# Reformat the training examples
reformatted_examples = []
for example in training_examples:
    input_key = example["original_key"]
    input_value = example["value"]
    target_key = example["target_key"]
    target_value = example["value"]
    
    reformatted_example = {
        "input": {input_key: input_value},
        "output": {target_key: target_value}
    }
    reformatted_examples.append(reformatted_example)

# Save the reformatted examples to a new JSON file
with open("training_validation.json", "w") as file:
    json.dump(reformatted_examples, file, indent=2)

print("Reformatted training examples saved in 'training_validation.json'.")
