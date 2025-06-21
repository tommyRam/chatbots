"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ResizableLayout(
    children: {leftComponent: React.ReactNode, rightComponent: React.ReactNode}
) {
    const [leftWidth, setLeftWidth] = useState(50); // percentage
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
        if(!isResizing || !containerRef.current) return;

        const container = containerRef.current as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        const contrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
        setLeftWidth(contrainedWidth)
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if(isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return (
        <div
            className="flex-1 flex bg-gray-700"
        >
            <div 
                ref={containerRef}
                className="flex-1 flex overflow-hidden bg-red-800"
            >
                <div
                    className="border-r border-gray-300"
                    style={{ width: `${leftWidth}%` }}
                    
                >
                    {children.leftComponent}
                </div>
                <div 
                    className="w-1 bg-amber-800 hover:bg-amber-950 cursor-col-resize transition-colors"
                    onMouseDown={handleMouseDown}
                />
                <div
                    className="flex"
                    style={{width: `${100 - leftWidth}%`}}
                >
                    {children.rightComponent}
                </div>
            </div>
        </div>
    )
}