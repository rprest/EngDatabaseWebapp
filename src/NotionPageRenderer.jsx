import React from "react";

const NotionPageRenderer = ({ blocks }) => {

    const renderBlock = (block) => {
        const { type, id } = block;
        const value = block[type];

        if (type === 'unsupported') {
            return null;
        }

        switch (type) {

            case 'paragraph':
                return (
                    <div key={id}>
                        <p>
                            {renderRichText(value.rich_text)}
                        </p>
                    </div>
                );

            case 'heading_1':
                return (
                    <div key={id}>
                        <h1>
                            {renderRichText(value.rich_text)}
                        </h1>
                    </div>
                )

            case 'heading_2':
                return (
                    <div key={id}>
                        <h2>
                            {renderRichText(value.rich_text)}
                        </h2>
                    </div>
                )

            case 'heading_3':
                return (
                    <div key={id}>
                        <h3>
                            {renderRichText(value.rich_text)}
                        </h3>
                    </div>
                )

            case 'callout':
                const getCalloutColor = (color) => {
                    const colorMap = {
                        'default_background': 'border-neutral-800',
                        'blue_background': 'bg-[#2C384F] border-none',
                        'orange_background': 'bg-[#4B3621] border-none',
                        'purple_background': 'bg-[#382E46] border-none',
                        'green_background': 'bg-[#2F3D31] border-none',
                        'red_background': 'bg-[#472D29] border-none',
                        'yellow_background': 'bg-[#4C4427] border-none',
                    };
                    return colorMap[color] || colorMap['default_background'];
                };

                return (
                    <div key={id} className={`flex gap-3 p-4 rounded-md my-2 border ${getCalloutColor(value.color)}`}>
                        {/* <span className="text-2xl">{value.icon?.emoji || '💡'}</span> */}
                        <div className="flex-1">
                        {renderRichText(value.rich_text)}
                        {block.children && renderChildren(block.children)}
                        </div>
                    </div>
                );

            default:
                return null;
        }

    }

    const renderRichText = (richTextArray) => {
        if (!richTextArray || richTextArray.length === 0) return null;

        return richTextArray.map((text, idx) => {
            const annotations = text.annotations;

            let className = '';
            if (annotations.bold) className += 'font-bold ';
            if (annotations.italic) className += 'italic ';
            if (annotations.strikethrough) className += 'line-through ';
            if (annotations.underline) className += 'underline ';
            if (annotations.code) className += 'bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono ';

            // Handle text color
            if (annotations.color && annotations.color !== 'default') {
                const colorMap = {
                'orange': 'text-[#CB7B37]',
                'blue': 'text-[#447ACB]',
                'red': 'text-[#BE524B]',
                'green': 'text-[#4F9768]',
                'purple': 'text-[#865DBB]',
                'yellow': 'text-[#C19138]',
                };
                className += colorMap[annotations.color] || '';
            }

            let content = text.plain_text;

            if (text.href) {
                return (
                <a
                    key={idx}
                    href={text.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:text-blue-800 underline ${className}`}
                >
                    {content}
                </a>
                );
            }

            return <span key={idx} className={className.trim()}>{content}</span>;
        });
    }

    const groupBlocks = (blocks) => {
        const grouped = [];
        let currentList = null;

        blocks.forEach((block) => {
        if (block.type === 'bulleted_list_item') {
            if (!currentList) {
            currentList = { type: 'bulleted', items: [] };
            }
            currentList.items.push(block);
        } else {
            if (currentList) {
            grouped.push(currentList);
            currentList = null;
            }
            grouped.push(block);
        }
        });

        if (currentList) grouped.push(currentList);
        return grouped;
    };

    const renderChildren = (children) => {
        const groupedChildren = groupBlocks(children);
        return groupedChildren.map((item, idx) => {
        if (item.type === 'bulleted') {
            return (
            <ul key={`list-${idx}`} className="list-disc ml-6">
                {item.items.map(renderBlock)}
            </ul>
            );
        } else {
            return renderBlock(item);
        }
        });
    };

    if (!blocks || blocks.length === 0) {
        return <div className="text-gray-500">No content to display</div>;
    }

    const groupedBlocks = groupBlocks(blocks);

    return (
    <div className="max-w-4xl mx-auto px-8 py-8 text-gray-200 leading-relaxed">
      {groupedBlocks.map((item, idx) => {
        if (item.type === 'bulleted') {
          return (
            <ul key={`list-${idx}`} className="list-disc ml-6 my-2">
              {item.items.map(renderBlock)}
            </ul>
          );
        } else {
          return renderBlock(item);
        }
      })}
    </div>
  );
};

export default NotionPageRenderer;