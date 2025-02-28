import React, { useCallback, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import './App.css';
// import './tailwind-config.js';
// import './tailwind.css';
import CustomNode from './CustomNode';

export const initialNodes = [
    {
        id: '1',
        type: 'custom',
        data: {
            label: 'Custom Node 1',
            emoji: '👩‍💻',
            name: 'Alice',
            job: 'Developer',
        },
        position: { x: 250, y: 5 },
    },
];

const nodeTypes = {
    custom: CustomNode,
};

const DraggableNode = ({ label, type }) => {
    const onDragStart = (event) => {
        event.dataTransfer.setData("application/reactflow", type);
        event.dataTransfer.setData("node-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            style={{
                padding: 10,
                margin: 5,
                background: "#ddd",
                cursor: "grab",
            }}
        >
            {label}
        </div>
    );
};

const FlowCanvas = ({
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    history,
    setHistory,
    redoStack,
    setRedoStack,
    selectedNode,
    setSelectedNode,
    onInit,
}) => {

    const { screenToFlowPosition } = useReactFlow();

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("node-label");
            if (!type || !label) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${nodes.length + 1}`,
                type: 'custom', // Use your custom type here
                data: { label, emoji: '😀', name: label, job: 'Developer' }, // Customize data
                position,
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, nodes, setNodes]
    );


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const saveHistory = () => {
        setHistory((prev) => [...prev, { nodes, edges }]);
        setRedoStack([]);
    };

    const addNode = () => {
        saveHistory();
        const newNode = {
            id: (nodes.length + 1).toString(),
            type: 'custom',
            data: {
                label: `Table project data ${nodes.length + 1}`,
                emoji: '📝',
                name: `Node ${nodes.length + 1}`,
                job: 'Designer',
            },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };
        setNodes((prev) => [...prev, newNode]);
    };

    const onNodeClick = (_, node) => {
        setSelectedNode(node.id);
    };

    const deleteNode = () => {
        if (!selectedNode) return;
        saveHistory();

        setNodes((prev) => prev.filter((node) => node.id !== selectedNode));
        setEdges((prev) =>
            prev.filter(
                (edge) => edge.source !== selectedNode && edge.target !== selectedNode
            )
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
        // setSavedState({ nodes, edges });
        setHistory([]);
        setRedoStack([]);
        alert("Flow saved successfully!");
        console.log("Saved Nodes:", nodes);
        console.log("Saved Edges:", edges);
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
        <div style={{ flex: 1, height: "100vh" }}>
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
                onInit={onInit}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

const PulseArc = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const onInit = (instance) => setReactFlowInstance(instance);

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: "flex", height: "100vh" }}>
                {/* Sidebar */}


                {/* Main Flow Editor */}
                <ReactFlowProvider>
                    <FlowCanvas
                        nodes={nodes}
                        setNodes={setNodes}
                        onNodesChange={onNodesChange}
                        edges={edges}
                        setEdges={setEdges}
                        onEdgesChange={onEdgesChange}
                        history={history}
                        setHistory={setHistory}
                        redoStack={redoStack}
                        setRedoStack={setRedoStack}
                        selectedNode={selectedNode}
                        setSelectedNode={setSelectedNode}
                        onInit={onInit}
                        reactFlowInstance={reactFlowInstance}
                    />
                </ReactFlowProvider>
                <div style={{ width: 200, padding: 10, background: "#f0f0f0" }}>
                    <h4>Drag Nodes</h4>
                    <DraggableNode id="Node1" label="Table Node" type="default" />
                    <DraggableNode id="Node2" label="Process Node" type="process" />
                </div>
            </div>
        </DndProvider>
    );
};

export default PulseArc;