import { useState, useMemo, useRef, useEffect } from 'react';
import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function AskView({ reportData }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi — I'm DiagnoLens. Ask me anything about your results, and I'll explain in plain language." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const bioCtx = useMemo(() => {
    if (!reportData?.biomarkers?.length) return null;
    return reportData.biomarkers
      .map(b => `${b.name}: ${b.value} ${b.unit} (${b.apiStatus || b.status})`)
      .join(', ');
  }, [reportData]);

  const suggestions = useMemo(() => {
    if (!reportData?.biomarkers?.length) {
      return ['Which results should I discuss with my doctor?', 'What do these numbers mean?'];
    }
    const abnormal = reportData.biomarkers.filter(b => b.is_abnormal).slice(0, 2);
    return [
      ...abnormal.map(b => `What does my ${b.name} result mean?`),
      'Which results should I discuss with my doctor?',
    ].slice(0, 3);
  }, [reportData]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const ctx = bioCtx
        ? `The user has these biomarker results: ${bioCtx}.`
        : 'The user has not yet uploaded a report.';
      const reply = await window.claude?.complete?.({
        messages: [{
          role: 'user',
          content: `You are DiagnoLens, a helpful health analysis assistant. ${ctx} Answer the following question in plain language, clearly and concisely. Always recommend discussing with a physician before making clinical decisions. Question: ${q}`
        }]
      });
      setMessages(m => [...m, { role: 'assistant', text: reply || 'I had trouble getting a response. Please try again.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: "I'm having a bit of trouble right now — please try again in a moment." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 580, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
            border: `1px solid ${m.role === 'user' ? 'rgba(0,201,167,0.2)' : DL_COLORS.border}`,
            borderRadius: 12, padding: '10px 14px',
            maxWidth: '85%', fontSize: 13, lineHeight: 1.65,
          }}>{m.text}</div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: DL_COLORS.fgMuted,
                  animation: `dotPulse 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                borderRadius: 100, padding: '6px 12px', color: DL_COLORS.fgSecondary,
                fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = DL_COLORS.accentBorder; e.currentTarget.style.color = DL_COLORS.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DL_COLORS.border; e.currentTarget.style.color = DL_COLORS.fgSecondary; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${DL_COLORS.border}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about your results…"
          style={{
            flex: 1, background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
            borderRadius: 8, padding: '10px 14px', color: DL_COLORS.fgPrimary,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
          }}
        />
        <Button variant="primary" onClick={() => send()} disabled={!input.trim() || loading}>
          <Icon name="send" size={13} />
        </Button>
      </div>
    </div>
  );
}
