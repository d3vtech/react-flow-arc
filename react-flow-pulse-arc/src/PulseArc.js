
import React, { useState } from "react";
import {
    ReactFlow,
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
    {
        id: "1",
        data: { label: "Table project data 1" },
        position: { x: 250, y: 5 },
    },
];

const PulseArc = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [savedState, setSavedState] = useState({ nodes: initialNodes, edges: [] });
    const [selectedNode, setSelectedNode] = useState(null);

    const saveHistory = () => {
        setHistory((prev) => [...prev, { nodes, edges }]);
        setRedoStack([]);
    };

    const addNode = () => {
        saveHistory();
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { label: `Table project data ${nodes.length + 1}` },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };
        setNodes((prev) => [...prev, newNode]);
    };

    const onNodeClick = (event, node) => {
        setSelectedNode(node.id);
    };

    const deleteNode = () => {
        if (!selectedNode) return;
        saveHistory();

        setNodes((prev) => prev.filter((node) => node.id !== selectedNode));
        setEdges((prev) =>
            prev.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode)
        );

        setSelectedNode(null);
    };

    const handleNodesChange = (changes) => {
        saveHistory();
        onNodesChange(changes);
    };

    const handleEdgeAdd = (connection) => {
        saveHistory();
        setEdges((prev) => addEdge(connection, prev));
    };

    const saveData = () => {
        setSavedState({ nodes, edges });
        setHistory([]);
        setRedoStack([]);
        alert("Flow saved successfully!");
    };

    const undo = () => {
        if (history.length === 0) return;
        const prevState = history[history.length - 1];

        setRedoStack((prev) => [...prev, { nodes, edges }]);
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        setHistory(history.slice(0, -1));
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];

        setHistory((prev) => [...prev, { nodes, edges }]);
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        setRedoStack(redoStack.slice(0, -1));
    };

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div className="flow-div">
                <button onClick={addNode}>Add Node</button>
                <button onClick={deleteNode} disabled={!selectedNode}>
                    Delete Selected Node
                </button>
                <button onClick={undo} disabled={history.length === 0}>
                    Undo
                </button>
                <button onClick={redo} disabled={redoStack.length === 0}>
                    Redo
                </button>
                <button onClick={saveData}>Save</button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleEdgeAdd}
                onNodeClick={onNodeClick}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default PulseArc;
