import { useState, useEffect, useRef } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function ActiveInterview({ interviewId, onBack, onComplete }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionNo, setQuestionNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Keep history of Q&A for the chat UI
  const [chatHistory, setChatHistory] = useState([]);
  
  const [loadingHistory, setLoadingHistory] = useState(!!interviewId);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch next question
  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await client.post('/api/get_interview_questions');
      if (res.data.question) {
        setQuestion(res.data.question);
        setQuestionNo(res.data.question_no || (questionNo + 1));
      } else {
        // If question is null, the interview is completed
        setIsComplete(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load the next question.');
    } finally {
      setLoading(false);
    }
  };

  // Start the interview
  const handleStart = () => {
    setHasStarted(true);
    fetchNextQuestion();
  };

  // Submit answer
  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    const submittedAnswer = answer.trim();
    setSubmitting(true);
    
    try {
      await client.post('/api/post_answer', { answer: submittedAnswer });
      
      // Add current Q&A to chat history before fetching next
      setChatHistory(prev => [
        ...prev, 
        { qNo: questionNo, q: question, a: submittedAnswer }
      ]);
      
      setAnswer('');
      setQuestion(null); // Clear question to show typing state
      
      if (questionNo >= 10) {
        setIsComplete(true);
      } else {
        await fetchNextQuestion();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  }, [answer]);

  // Fetch chat history on resume
  useEffect(() => {
    if (interviewId && !hasStarted) {
      setLoadingHistory(true);
      client.get(`/api/interview_details/${interviewId}`)
        .then(res => {
          if (res.data && res.data.q_and_a && res.data.q_and_a.length > 0) {
            const history = res.data.q_and_a.map((qa, idx) => ({
              qNo: idx + 1,
              q: qa.question,
              a: qa.answer
            }));
            setChatHistory(history);
            setHasStarted(true);
            setQuestionNo(history.length + 1);
            fetchNextQuestion();
          }
        })
        .catch(err => {
          console.error("Failed to fetch chat history", err);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    } else {
      setLoadingHistory(false);
    }
  }, [interviewId, hasStarted]);

  // Scroll to bottom when new question/answer appears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, question, loading]);

  if (loadingHistory) {
    return (
      <div className="bg-bg-surface border border-border rounded-3xl min-h-[500px] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="flex gap-2 mb-4">
           <span className="w-3 h-3 rounded-full bg-primary animate-bounce"></span>
           <span className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }}></span>
           <span className="w-3 h-3 rounded-full bg-success animate-bounce" style={{ animationDelay: '0.3s' }}></span>
        </div>
        <p className="text-text-secondary font-medium">Loading interview data...</p>
      </div>
    );
  }

  // Instructions screen
  if (!hasStarted) {
    return (
      <div className="bg-bg-surface border border-border rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 border-b border-border">
          <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-medium mb-6">
            <span>←</span> Back to Dashboard
          </button>
          
          <h2 className="text-3xl font-black text-text-primary mb-2">Interview Setup & Instructions</h2>
          <p className="text-text-secondary text-lg">Please read the following instructions carefully before starting your mock interview.</p>
        </div>

        <div className="p-8 space-y-8 bg-bg-surface-2/50">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <span>⏱️</span> Time limit
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                There is no strict time limit, but try to answer questions concisely as you would in a real interview. Expect the session to take around 15-20 minutes.
              </p>
            </div>

            <div className="bg-bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
                <span>🤖</span> AI Interviewer
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                The AI will evaluate your answers based on your target role and difficulty. It may ask follow-up questions if your answer lacks detail.
              </p>
            </div>

            <div className="bg-bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-success mb-3 flex items-center gap-2">
                <span>📝</span> Format
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                You will be presented with one question at a time. Read it carefully, type your answer in the text box, and submit it when ready.
              </p>
            </div>

            <div className="bg-bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-warning mb-3 flex items-center gap-2">
                <span>⚠️</span> Honest Effort
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Do not look up answers. This is for your own practice. If you don't know the answer, state that honestly—the AI will guide you and grade accordingly.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center pt-6 border-t border-border">
            <p className="text-text-muted text-sm font-medium mb-4">Are you ready to begin?</p>
            <button 
              onClick={handleStart}
              className="px-10 py-4 bg-gradient-to-r from-primary to-accent text-white font-black text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-primary/20 btn-press flex items-center gap-3"
            >
              Start Interview Now 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="bg-bg-surface border border-border rounded-3xl overflow-hidden animate-in fade-in duration-500 min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center text-4xl mb-6">
          🎉
        </div>
        <h2 className="text-3xl font-black text-text-primary mb-4">Interview Completed!</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-8 text-lg">
          You've successfully answered all questions. The AI has generated your detailed feedback report and final score.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-bg-surface-2 border border-border rounded-xl font-bold hover:bg-primary/10 hover:text-primary transition-colors btn-press"
          >
            Dashboard
          </button>
          <button 
            onClick={onComplete}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-light transition-all btn-press"
          >
            View Report →
          </button>
        </div>
      </div>
    );
  }

  // Q&A Interface
  return (
    <div className="bg-bg-surface border border-border rounded-3xl overflow-hidden flex flex-col h-[750px] animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-border bg-bg-surface/80 backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-lg leading-tight">AI Interviewer</h3>
            <p className="text-xs text-success font-medium flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Active Session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-bg-surface-2 border border-border rounded-lg text-xs font-semibold text-text-secondary">
            <span>Question</span>
            <span className="text-primary">{questionNo}</span>
            <span className="text-border-light">/</span>
            <span>10</span>
          </div>
          <button 
            onClick={onBack} 
            className="px-4 py-2 bg-bg-surface-2 border border-border rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-border-light transition-colors"
          >
            Pause & Exit
          </button>
        </div>
      </div>

      {/* Main Content Area (Chat History) */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 bg-bg-surface scroll-smooth z-0">
        <div className="max-w-3xl mx-auto space-y-10 pb-10">
          
          {/* Previous Q&A */}
          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-6">
              {/* Question Bubble */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xl border border-primary/20">
                  🤖
                </div>
                <div className="bg-bg-surface-2 border border-border rounded-2xl rounded-tl-sm p-5 shadow-sm flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Question {item.qNo}</p>
                  <p className="text-text-primary text-[15px] leading-relaxed">{item.q}</p>
                </div>
              </div>
              
              {/* Answer Bubble */}
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center text-xl border border-accent/20">
                  👤
                </div>
                <div className="bg-primary text-white rounded-2xl rounded-tr-sm p-5 shadow-md max-w-[85%]">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{item.a}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Current Question */}
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xl border border-primary/20">
              🤖
            </div>
            <div className="bg-bg-surface-2 border border-border rounded-2xl rounded-tl-sm p-5 shadow-sm flex-1 relative">
              {(loading && !question) ? (
                <div className="flex items-center gap-2 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="ml-3 text-text-muted text-sm font-medium">Analyzing your answer & preparing next question...</span>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex justify-between">
                    <span>Question {questionNo}</span>
                  </p>
                  <p className="text-text-primary text-lg leading-relaxed font-medium">{question}</p>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-bg-surface/80 backdrop-blur-md z-10 relative">
        <div className="max-w-3xl mx-auto flex gap-4 items-end">
          <div className="flex-1 relative group">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={(loading && !question) ? "Wait for the question..." : "Type your detailed answer here..."}
              disabled={loading || submitting || !question}
              className="w-full px-5 py-4 bg-bg-surface border border-border rounded-2xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-all resize-none shadow-sm group-hover:border-border-light disabled:opacity-50 min-h-[60px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="absolute right-4 bottom-3 text-[10px] uppercase tracking-wider font-bold text-text-muted pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
              Press Enter to send
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || loading || submitting || !question}
            className="w-14 h-14 bg-gradient-to-br from-primary to-accent text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 btn-press flex-shrink-0"
          >
            {submitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
