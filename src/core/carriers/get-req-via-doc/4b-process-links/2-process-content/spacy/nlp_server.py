import spacy
from flask import Flask, request, jsonify

app = Flask(__name__)
nlp = spacy.load('en_core_web_sm')

def extract_relevant_info(doc):
    keywords = ['api', 'api key', 'account number', 'authentication', 'credentials']
    steps = []
    seen_keywords = set()

    for keyword in keywords:
        if keyword in seen_keywords:
            continue
        for sentence in doc.sents:
            if keyword.lower() in sentence.text.lower():
                steps.append({
                    'keyword': keyword,
                    'text': sentence.text
                })
                seen_keywords.add(keyword)
                break  # Add only once per keyword

    return steps

def is_detail_too_long(detail, max_chars_per_detail=120):
    return len(detail) > max_chars_per_detail

def split_text_into_details(text, max_chars_per_detail=120, max_details=4):
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    details = []
    current_detail = ''
    current_length = 0

    for sentence in sentences:
        sentence_length = len(sentence) + 1  # Including space for adding the sentence

        # If the current sentence alone exceeds the max length, split it
        if sentence_length > max_chars_per_detail:
            # Split long sentence into smaller parts
            for part in split_long_sentence(sentence):
                if current_length + len(part) + 1 > max_chars_per_detail:
                    if current_detail:
                        details.append(current_detail.strip() + '.')
                        current_detail = ''
                        current_length = 0

                    if len(details) >= max_details - 1:
                        break

                current_detail += part + ' '
                current_length += len(part) + 1

        else:
            # If adding this sentence would exceed the max length, finalize the current detail
            if current_length + sentence_length > max_chars_per_detail:
                if current_detail:
                    details.append(current_detail.strip() + '.')
                    current_detail = ''
                    current_length = 0

                if len(details) >= max_details - 1:
                    break

            current_detail += sentence + ' '
            current_length += sentence_length

    # Ensure the last detail is added
    if current_detail:
        details.append(current_detail.strip() + '.')

    # Fill any remaining details with empty strings
    while len(details) < max_details:
        details.append('')

    return details


def split_long_sentence(sentence, max_chars_per_detail=120):
    # Split a long sentence into chunks that fit within the max_chars_per_detail
    parts = []
    while len(sentence) > max_chars_per_detail:
        split_point = sentence.rfind(' ', 0, max_chars_per_detail)
        if split_point == -1:
            split_point = max_chars_per_detail
        parts.append(sentence[:split_point].strip())
        sentence = sentence[split_point:].strip()
    if sentence:
        parts.append(sentence.strip())
    return parts



@app.route('/analyze', methods=['POST'])
def analyze():
    content = request.json.get('content', '')
    if not content:
        return jsonify({'error': 'No content provided'}), 400

    doc = nlp(content)
    steps = extract_relevant_info(doc)

    formatted_steps = []
    for idx, step in enumerate(steps):
        if 'text' in step:
            details = split_text_into_details(step['text'])
            # Capitalize the first letter of each detail
            details = [detail.capitalize() for detail in details]
            step['details'] = details
            del step['text']

        formatted_steps.append({
            'keyword': step['keyword'],
            'stepsDetails': {
                'step': idx + 1,
                'stepTitle': f"How to find your {step['keyword'].capitalize()}",
                'details1': step['details'][0] if len(step['details']) > 0 else '',
                'details2': step['details'][1] if len(step['details']) > 1 else '',
                'details3': step['details'][2] if len(step['details']) > 2 else '',
                'details4': step['details'][3] if len(step['details']) > 3 else '',
            },
            'form': {
                'instruction': f"Provide your {step['keyword']}.",
                'label': step['keyword'].capitalize(),
                'expectedFieldName': step['keyword'].replace(' ', '').lower(),
                'title': f"Enter your {step['keyword'].capitalize()}",
                'placeholder': 'Text'
            }
        })

    return jsonify(formatted_steps)

if __name__ == '__main__':
    app.run(port=5000)
