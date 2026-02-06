import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-10 max-w-2xl mx-auto text-center">
      <div className="w-24 h-24 bg-brand-100 rounded-full mx-auto flex items-center justify-center mb-6">
        <span className="text-4xl">🎓</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Về Thầy Tiêu Quang Thạch</h1>
      <p className="text-slate-600 leading-relaxed mb-8">
        Đây là ứng dụng hỗ trợ học tập môn Toán dành cho học sinh THCS. 
        Ứng dụng sử dụng công nghệ AI tiên tiến từ Google (Gemini) để giúp các em giải đáp thắc mắc, 
        tìm phương pháp giải hay và luyện tập các dạng bài tập đa dạng.
      </p>

      <div className="grid gap-4">
        <a href="https://github.com/tieuquangthach" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
            <Github size={20} />
            <span>Xem GitHub Profile</span>
        </a>
        <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <ExternalLink size={20} />
            <span>Powered by Google AI Studio</span>
        </a>
      </div>
    </div>
  );
};

export default AboutPage;