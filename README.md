## Instructions for Installing and Running the Python Server

This server is used to process certain information in the core of the backend.

1. **Navigate to the server directory:**

   ```bash
   cd src/core/carriers/get-req-via-doc/4b-process-links/2-process-content/spacy
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   On Windows:

   ```bash
    source venv/scripts/activate
   ```

   On Linux:

   ```bash
    source venv/bin/activate
   ```

4. **Install the required packages:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Download the SpaCy language model:**

   ```bash
   python -m spacy download en_core_web_sm
   ```

6. **Run the server:**

   ```bash
    python nlp_server.py
   ```
