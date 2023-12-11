import { MathJax, MathJaxContext } from 'better-react-mathjax'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import RemarkMathPlugin from 'remark-math'

const addSlashes = (str) => {
  return `\\(${str}\\)`
}

const _mapProps = (props) => ({
  ...props,
  remarkPlugins: [RemarkMathPlugin],
  components: {
    ...props.components,
    code: ({ className, children, node, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      if (match && match[1] === 'math') {
        const inline = className.includes('inline')
        return <MathJax inline={inline}>{addSlashes(children)}</MathJax>
      }
      return match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          PreTag='div'
          children={String(children).replace(/\n$/, '')}
          style={monokai}
          customStyle={{
            background: 'none',
          }}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  },
})

const Markdown = (props) => (
  <MathJaxContext>
    <ReactMarkdown {..._mapProps(props)} />
  </MathJaxContext>
)

export default Markdown
