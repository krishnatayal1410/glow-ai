# glow_ai_app.py
# Streamlit App for Glow AI - Solo Founder Prototype

import streamlit as st
from PIL import Image
import random
import base64

# ----- Simulated AI Model Output -----
skin_conditions = [
    "Mild Acne",
    "Oily Skin",
    "Dry Skin",
    "Redness / Irritation",
    "Hyperpigmentation",
    "Combination Skin"
]

products = {
    "Mild Acne": [
        {"name": "CeraVe Foaming Cleanser", "price": "$12", "link": "https://amzn.to/ceravecleanser"},
        {"name": "The Ordinary Niacinamide 10%", "price": "$6", "link": "https://amzn.to/niacinamide"},
        {"name": "Differin Adapalene Gel", "price": "$13", "link": "https://amzn.to/differin"},
    ],
    "Oily Skin": [
        {"name": "La Roche-Posay Effaclar Gel", "price": "$15", "link": "https://amzn.to/lrp-gel"},
        {"name": "Paula's Choice BHA", "price": "$34", "link": "https://amzn.to/bha"},
        {"name": "Neutrogena Oil-Free Moisturizer", "price": "$10", "link": "https://amzn.to/neutrogena-moist"},
    ],
    "Dry Skin": [
        {"name": "Cetaphil Gentle Cleanser", "price": "$9", "link": "https://amzn.to/cetaphil"},
        {"name": "CeraVe Moisturizing Cream", "price": "$15", "link": "https://amzn.to/cerave-cream"},
        {"name": "The Ordinary Hyaluronic Acid", "price": "$7", "link": "https://amzn.to/hyaluronic"},
    ],
    # Add more conditions if needed
}

def generate_routine(condition):
    steps = {
        "Cleanser": "Use morning and night.",
        "Treatment": "Apply targeted serum after cleansing.",
        "Moisturizer": "Use to lock in hydration.",
        "SPF (AM)": "Apply sunscreen every morning."
    }
    routine = f"### 30-Day Routine for {condition}\n"
    for step, note in steps.items():
        routine += f"- **{step}**: {note}\n"
    return routine

# ----- Streamlit UI -----
st.set_page_config(page_title="Glow AI Prototype", layout="centered")
st.title("✨ Glow AI - Skin Analysis Prototype")
st.markdown("Upload a selfie to get instant skin analysis, product suggestions, and a 30-day skincare routine.")

uploaded_image = st.file_uploader("Upload your face photo", type=["jpg", "jpeg", "png"])

if uploaded_image:
    image = Image.open(uploaded_image)
    st.image(image, caption="Your Uploaded Image", use_column_width=True)

    with st.spinner("Analyzing your skin..."):
        detected_condition = random.choice(skin_conditions)

    st.success(f"Detected Condition: **{detected_condition}**")

    st.markdown("---")
    st.subheader("Recommended Products")
    for product in products.get(detected_condition, []):
        st.markdown(f"**{product['name']}** - {product['price']}  ")
        st.markdown(f"[View Product]({product['link']})")

    st.markdown("---")
    st.subheader("Your 30-Day Skincare Routine")
    st.markdown(generate_routine(detected_condition))

    st.markdown("---")
    st.caption("Disclaimer: This is a wellness tool. For medical concerns, consult a dermatologist.")
else:
    st.info("Please upload a clear photo of your face to begin.")

