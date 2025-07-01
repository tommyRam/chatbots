"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableLayoutProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

export default function ResizableLayout({ leftComponent, rightComponent }: ResizableLayoutProps) {
    const [leftWidth, setLeftWidth] = useState(50); // percentage
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
        if(!isResizing || !containerRef.current) return;

        const container = containerRef.current as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        var constrainedWidth = Math.max(35, Math.min(80, newLeftWidth));
        constrainedWidth = Math.min(constrainedWidth, 65);
        setLeftWidth(constrainedWidth);
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
        <div className="h-full">
            <div ref={containerRef} className="h-full w-full flex">
                <div 
                    className="bg-white flex justify-center items-center" 
                    style={{ width: `calc(${leftWidth}% - 4px)` }}
                >
                    {leftComponent}
                </div>

                <div 
                    className="flex justify-center items-center w-1.5 h-full bg-transparent hover:bg-purple-300 cursor-col-resize transition-colors flex-shrink-0 group" 
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-0.5 h-8 bg-purple-800 rounded-full group-hover:bg-gray-400 transition-colors"></div>
                </div>

                <div 
                    className="bg-white flex justify-center items-center flex-1"
                >
                    {rightComponent}
                </div>
            </div>
        </div>
    );
}