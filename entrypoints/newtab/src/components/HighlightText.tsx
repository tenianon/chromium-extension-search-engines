import React, { memo } from 'react'

interface HighlightTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  keywords?: Array<string>
  keywordClassName?: React.HTMLAttributes<HTMLElement>['className']
  keywordStyle?: React.HTMLAttributes<HTMLElement>['style']
  children?: string
}

const HighlightText: React.FC<HighlightTextProps> = memo(
  ({
    keywords = [],
    children: context = '',
    keywordClassName = '',
    keywordStyle = {},
    ...props
  }) => {
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')

    const highlightedText = context.split(regex).map((part, index) => {
      if (
        keywords.some(
          (keyword) => keyword && keyword.toLowerCase() === part.toLowerCase(),
        )
      ) {
        return (
          <span
            key={index}
            className={keywordClassName}
            style={keywordStyle}
          >
            {part}
          </span>
        )
      }

      return part
    })

    return <div {...props}>{highlightedText}</div>
  },
)

export default HighlightText
