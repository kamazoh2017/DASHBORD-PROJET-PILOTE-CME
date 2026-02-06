'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-300">
      {title && (
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium flex justify-between items-center">
          <span>{title}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            {copied ? '✓ Copié' : '📋 Copier'}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors z-10"
          >
            {copied ? '✓ Copié' : '📋 Copier'}
          </button>
        )}
        <SyntaxHighlighter 
          language={language} 
          style={tomorrow}
          customStyle={{ margin: 0, borderRadius: 0 }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
