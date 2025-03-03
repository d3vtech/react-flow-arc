import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './App.css';

function CustomNode({ data }) {
    return (
        <div className="custom-node">
            <div className="flex">
                <div className="rounded-full mt-1 ml-1 w-12 h-12 flex justify-center items-center bg-gray-100 !important">
                    {data.emoji}
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">{data.name}</div>
                    <div className="text-gray-500">{data.job}</div>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !bg-teal-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-teal-500"
            />
            
        </div>
    );
}

export default memo(CustomNode);