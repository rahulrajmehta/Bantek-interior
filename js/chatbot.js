/* ==========================================================================
   BANTEK INTERIOR - AI DESIGN CONCIERGE CHATBOT
   Interactive Interior Assistant & Lead Assistant
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAiChatbot();
});

function initAiChatbot() {
  const chatbotTrigger = document.getElementById('chatbotTrigger');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  if (!chatbotWindow) return;

  // Toggle Chatbot
  function toggleChatbot() {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
      if (chatInput) chatInput.focus();
      // If first time open and empty, seed greeting
      if (chatMessages && chatMessages.children.length === 0) {
        sendBotGreeting();
      }
    }
  }

  if (chatbotTrigger) chatbotTrigger.addEventListener('click', toggleChatbot);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', () => chatbotWindow.classList.remove('active'));

  // Initial Greeting
  function sendBotGreeting() {
    const greetingText = `Namaste! 🙏 Welcome to **Bantek Interior** (Ranchi). I'm your AI Interior Design Concierge. How can I help you elevate your dream space today?`;
    appendBotMessage(greetingText, [
      { text: "💰 Interior Cost Estimate", action: "estimate" },
      { text: "🍳 Modular Kitchen Design", action: "kitchen" },
      { text: "🛋️ Living Room Makeovers", action: "living" },
      { text: "📍 Book Free Site Visit in Ranchi", action: "visit" },
      { text: "👥 Talk to Lead Designers", action: "team" }
    ]);
  }

  // Append user message
  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgDiv);
    scrollChat();
  }

  // Append bot message
  function appendBotMessage(text, chips = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';

    let chipsHtml = '';
    if (chips && chips.length > 0) {
      chipsHtml = `<div class="chat-chips-container">` +
        chips.map(chip => `<button class="chat-chip" data-action="${chip.action}">${chip.text}</button>`).join('') +
        `</div>`;
    }

    msgDiv.innerHTML = `<div class="bubble">${formatMarkdown(text)}</div>${chipsHtml}`;
    chatMessages.appendChild(msgDiv);

    // Bind chip clicks
    const chipBtns = msgDiv.querySelectorAll('.chat-chip');
    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const chipText = btn.innerText;
        appendUserMessage(chipText);
        handleAction(action, chipText);
      });
    });

    scrollChat();
  }

  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Process user actions and answers
  function handleAction(action, userText) {
    setTimeout(() => {
      switch(action) {
        case 'estimate':
          appendBotMessage(`For standard Ranchi apartments & villas, our turnkey architectural design costs typically range:
• **1 BHK**: ₹3.5L - ₹5.5L
• **2 BHK**: ₹6.5L - ₹9.5L
• **3 BHK**: ₹11L - ₹17L
• **Villas / Luxury**: Custom bespoke quote

Would you like our interactive calculator or an in-person measurement visit?`, [
            { text: "Use Online Calculator", action: "calc_redirect" },
            { text: "Book Free Site Consultation", action: "visit" }
          ]);
          break;

        case 'kitchen':
          appendBotMessage(`Our modular kitchens feature:
✨ German hardware (Hettich / Hafele)
✨ Waterproof Marine Ply (BWP grade)
✨ High-gloss Acrylic & PU Matte finishes
✨ Seamless Quartz & Granite countertops
✨ 10-Year Comprehensive Warranty

Would you like to speak directly with **Gargi Tewari** (our Lead Interior Designer)?`, [
            { text: "Yes, Connect on WhatsApp", action: "whatsapp_lead" },
            { text: "See Kitchen Portfolio", action: "portfolio_kitchen" }
          ]);
          break;

        case 'living':
          appendBotMessage(`We craft bespoke living spaces with:
• Fluted panels, veneer highlights & Italian marble feature walls
• Cove lighting & smart architectural false ceilings
• Custom luxury seating & media consoles tailored for Ranchi homes.

Would you like to schedule a design walkthrough?`, [
            { text: "Schedule Design Walkthrough", action: "visit" },
            { text: "Connect on WhatsApp", action: "whatsapp_lead" }
          ]);
          break;

        case 'visit':
          appendBotMessage(`We provide **Free Site Consultations** across Ranchi (Itki Rd, Bazra, Morabadi, Bariatu, Kanke, Doranda, Lalpur, Harmu, Ashok Nagar).

Please click below to share your site location and preferred date directly on WhatsApp:`, [
            { text: "📲 WhatsApp Site Visit Booking", action: "whatsapp_visit" },
            { text: "📞 Call Lead Engineer (095705 10050)", action: "call_direct" }
          ]);
          break;

        case 'team':
          appendBotMessage(`Our core Ranchi team includes:
• **Gargi Tewari**: Creative Design Lead (Concept aesthetics, 3D renders, mood boards)
• **Bahadur Kumar Modi**: Project Execution Lead (Flawless on-site construction & quality audit)

Our office is located at **Itki Rd, Bazra, Ranchi** and we are open daily till 11:00 PM!`, [
            { text: "Chat on WhatsApp with Team", action: "whatsapp_lead" },
            { text: "View Google Reviews (4.7★)", action: "reviews" }
          ]);
          break;

        case 'calc_redirect':
          const calcEl = document.getElementById('cost-estimator');
          if (calcEl) {
            chatbotWindow.classList.remove('active');
            calcEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = 'index.html#cost-estimator';
          }
          break;

        case 'portfolio_kitchen':
          window.location.href = 'portfolio.html';
          break;

        case 'reviews':
          const revEl = document.getElementById('testimonials');
          if (revEl) {
            chatbotWindow.classList.remove('active');
            revEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = 'index.html#testimonials';
          }
          break;

        case 'whatsapp_lead':
        case 'whatsapp_visit':
          const waMsg = encodeURIComponent("Hello Bantek Interior Ranchi! I was chatting with your AI Concierge on your website and would like to consult on my home interior design.");
          window.open(`https://wa.me/919570510050?text=${waMsg}`, '_blank');
          break;

        case 'call_direct':
          window.location.href = 'tel:09570510050';
          break;

        default:
          handleNaturalQuery(userText);
          break;
      }
    }, 400);
  }

  function handleNaturalQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('cost') || q.includes('price') || q.includes('budget') || q.includes('rate') || q.includes('kitna')) {
      handleAction('estimate', query);
    } else if (q.includes('kitchen') || q.includes('modular')) {
      handleAction('kitchen', query);
    } else if (q.includes('address') || q.includes('location') || q.includes('office') || q.includes('ranchi') || q.includes('kahan')) {
      appendBotMessage(`Our Ranchi Office is located at:
📍 **Itki Rd, Bazra, Sarweshwari Nagar, Pahartoli, Ranchi, Jharkhand 834005**
🕒 Open Daily until **11:00 PM**
📞 Phone: **095705 10050**`, [
        { text: "📍 Open in Google Maps", action: "open_maps" },
        { text: "💬 WhatsApp Us", action: "whatsapp_lead" }
      ]);
    } else if (q.includes('gargi') || q.includes('bahadur') || q.includes('team') || q.includes('designer')) {
      handleAction('team', query);
    } else {
      appendBotMessage(`Thank you for your question! As Ranchi's 4.7★ rated interior architecture studio, our team would love to assist you with exact designs, floor plans, and material samples.`, [
        { text: "📲 WhatsApp Instant Chat", action: "whatsapp_lead" },
        { text: "💰 Estimate Budget", action: "estimate" },
        { text: "📞 Call Now (095705 10050)", action: "call_direct" }
      ]);
    }
  }

  // Send button & enter key handler
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendUserMessage(text);
    chatInput.value = '';
    handleAction('natural', text);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', handleSendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }

  // Helpers
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatMarkdown(str) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
}
