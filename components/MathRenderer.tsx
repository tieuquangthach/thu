import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Customize link rendering if needed
          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
          // Ensure code blocks look decent
          code: ({ node, ...props }) => {
             // Basic check to see if it's inline code or block
             const match = /language-(\w+)/.exec(props.className || '');
             return match ? (
               <code className={props.className} {...props} />
             ) : (
               <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm font-mono" {...props} />
             );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathRenderer;