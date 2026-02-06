import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import MathRenderer from '../components/MathRenderer';
import { BrainCircuit, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const QuizPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setQuestions([]);
    setShowResults(false);
    setSelectedAnswers({});
    
    try {
        const jsonStr = await generateQuiz(topic);
        const parsed = JSON.parse(jsonStr);
        setQuestions(parsed);
    } catch (e) {
        console.error(e);
        alert("Không thể tạo câu hỏi lúc này. Vui lòng thử lại chủ đề khác.");
    } finally {
        setLoading(false);
    }
  };

  const handleSelect = (qIndex: number, option: string) => {
    if (showResults) return;
    // Extract option letter A, B, C, D
    const letter = option.split('.')[0].trim();
    setSelectedAnswers(prev => ({...prev, [qIndex]: letter}));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Luyện Tập Trắc Nghiệm</h2>
        <p className="text-slate-600">Nhập chủ đề em muốn ôn tập, thầy sẽ ra đề ngay.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex gap-4 flex-col md:flex-row">
            <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Hình học không gian, Định lý Pytago, Phương trình bậc 2..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-500 focus:outline-none"
            />
            <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div> : <BrainCircuit size={20} />}
                <span>Tạo Đề</span>
            </button>
        </div>
      </div>

      {/* Quiz List */}
      {questions.length > 0 && (
        <div className="space-y-8">
            {questions.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                const isSelected = !!selectedAnswers[idx];
                
                return (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded text-sm">Câu {idx + 1}</span>
                            <div className="flex-1 font-medium text-lg text-slate-800">
                                <MathRenderer content={q.question} />
                            </div>
                        </div>

                        <div className="grid gap-3 mb-4">
                            {q.options.map((opt, oIdx) => {
                                const optLetter = opt.split('.')[0].trim();
                                let bgClass = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                                
                                if (selectedAnswers[idx] === optLetter) {
                                    bgClass = "bg-brand-100 border-brand-500 text-brand-800 ring-1 ring-brand-500";
                                }
                                
                                if (showResults) {
                                    if (optLetter === q.correctAnswer) {
                                        bgClass = "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500";
                                    } else if (selectedAnswers[idx] === optLetter && optLetter !== q.correctAnswer) {
                                        bgClass = "bg-red-100 border-red-500 text-red-800 ring-1 ring-red-500";
                                    } else {
                                        bgClass = "opacity-50";
                                    }
                                }

                                return (
                                    <button 
                                        key={oIdx}
                                        onClick={() => handleSelect(idx, opt)}
                                        disabled={showResults}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${bgClass}`}
                                    >
                                        <MathRenderer content={opt} />
                                    </button>
                                )
                            })}
                        </div>

                        {showResults && (
                            <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    {isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                                    {isCorrect ? "Chính xác!" : `Sai rồi. Đáp án đúng là ${q.correctAnswer}`}
                                </div>
                                <div className="text-slate-700">
                                    <span className="font-semibold">Giải thích: </span>
                                    <MathRenderer content={q.explanation} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {!showResults && Object.keys(selectedAnswers).length === questions.length && (
                <button 
                    onClick={handleSubmit}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <span>Nộp Bài</span>
                    <ArrowRight size={20} />
                </button>
            )}
            
            {showResults && (
                <div className="sticky bottom-6 bg-white border border-slate-200 shadow-xl p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Kết quả của em</p>
                        <p className="text-3xl font-bold text-slate-800">{score}/{questions.length}</p>
                    </div>
                    <button 
                        onClick={() => {
                            setTopic('');
                            setQuestions([]);
                        }} 
                        className="text-brand-600 font-bold hover:underline"
                    >
                        Làm đề khác
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;