# Glow AI

A Streamlit proof of concept for a guided skincare experience. Users upload an image, receive a simulated skin-condition result, explore product suggestions, and get a structured 30-day routine.

> This repository is an early product prototype. Its analysis is simulated and must not be treated as medical advice or a production diagnostic system.

## Prototype flow

1. Upload a JPG or PNG image.
2. Generate a simulated skin-condition classification.
3. Display condition-specific product suggestions.
4. Produce a simple morning and evening routine.

## Stack

- Python
- Streamlit
- Pillow

## Run locally

```bash
git clone https://github.com/krishnatayal1410/glow-ai.git
cd glow-ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run glow_ai_app.py
```

## Responsible-use boundary

The current classifier selects from a predefined list and does not perform real computer-vision inference. A production version would require validated data, explicit consent, privacy safeguards, calibrated uncertainty, clinical review, and clear escalation to qualified professionals.

More product work: [krishnatayal.com](https://krishnatayal.com).
