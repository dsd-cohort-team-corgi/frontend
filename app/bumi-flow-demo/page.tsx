"use client";

import React from "react";
import {
  Background,
  ReactFlow,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  Controls,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  MessageSquare,
  Image as ImageIcon,
  Database,
  Braces,
  Bot,
  Shield,
  Star,
  GitBranch,
  Cog,
  CheckCircle2,
  ArrowRightCircle,
} from "lucide-react";
import BumiFlowHeader from "@/components/BumiFlowHeader";

type BasicNode = {
  id: string;
  type?: string;
  data: { label: string; iconName?: string };
  position: { x: number; y: number };
};

type BasicEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  type?: string;
};

function normalizeType(
  nodeType?: string,
): "input" | "output" | "default" | "icon" {
  if (
    nodeType === "input" ||
    nodeType === "output" ||
    nodeType === "default" ||
    nodeType === "icon"
  )
    return nodeType;
  return "default";
}

function toNodes(basicNodes: BasicNode[]): Node[] {
  return basicNodes.map((n) => ({
    id: n.id,
    type: normalizeType(n.type),
    position: n.position,
    data: { label: n.data.label, iconName: n.data.iconName },
  }));
}

function toEdges(basicEdges: BasicEdge[]): Edge[] {
  return basicEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated ?? false,
    style: e.style,
    type: e.type,
  }));
}

function BumiVideoDemo() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden">
      <div className="w-full" style={{ aspectRatio: "1/1" }}>
        <video
          className="w-full h-full object-contain rounded-2xl"
          autoPlay
          loop
          muted
          controls
        >
          <source src="/bumi-ai-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

// Minimal custom node with icon for the Combined view
function IconNode({
  data,
  id,
}: {
  data: { label: string; iconName?: string };
  id: string;
}) {
  const icon = (() => {
    switch (data.iconName) {
      case "message":
        return <MessageSquare size={16} />;
      case "image":
        return <ImageIcon size={16} />;
      case "database":
        return <Database size={16} />;
      case "braces":
        return <Braces size={16} />;
      case "bot":
        return <Bot size={16} />;
      case "shield":
        return <Shield size={16} />;
      case "star":
        return <Star size={16} />;
      case "git-branch":
        return <GitBranch size={16} />;
      case "cog":
        return <Cog size={16} />;
      case "check":
        return <CheckCircle2 size={16} />;
      case "arrow":
        return <ArrowRightCircle size={16} />;
      default:
        return null;
    }
  })();

  const isHighlighted = [
    "catalogue",
    "bookings",
    "prompt",
    "llm",
    "guard",
    "recs",
    "out_rec",
  ].includes(id);

  const isStartNode = id === "in_user";

  const getNodeStyle = () => {
    if (isStartNode) {
      return {
        position: "relative" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "8px 10px",
        border: "2px solid #059669",
        borderRadius: 8,
        background: "linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 100%)",
        color: "#065F46",
        boxShadow: "0 2px 8px rgba(5, 150, 105, 0.2)",
        width: "180px",
        minHeight: "36px",
        textAlign: "center" as const,
        fontWeight: "600" as const,
      };
    }
    if (isHighlighted) {
      return {
        position: "relative" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px solid #3B82F6",
        borderRadius: 8,
        background: "#F8FAFC",
        color: "#1E40AF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        width: "180px",
        minHeight: "36px",
        textAlign: "center" as const,
      };
    }
    return {
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "8px 10px",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      background: "#fff",
      color: "#6B7280",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      width: "180px",
      minHeight: "36px",
      textAlign: "center" as const,
    };
  };

  return (
    <div style={getNodeStyle()}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "1.2",
          wordBreak: "break-word",
        }}
      >
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export default function Page() {
  const combinedNodes: BasicNode[] = [
    {
      id: "in_user",
      type: "icon",
      data: { label: "User Input (Text/Voice→Text)", iconName: "message" },
      position: { x: 260, y: 0 },
    },
    {
      id: "in_image",
      type: "icon",
      data: { label: "Image Input", iconName: "image" },
      position: { x: 540, y: 0 },
    },

    {
      id: "catalogue",
      type: "icon",
      data: { label: "Service Catalogue", iconName: "database" },
      position: { x: 120, y: 100 },
    },
    {
      id: "bookings",
      type: "icon",
      data: { label: "User Bookings", iconName: "database" },
      position: { x: 400, y: 100 },
    },

    {
      id: "prompt",
      type: "icon",
      data: { label: "Prompt Builder", iconName: "braces" },
      position: { x: 260, y: 200 },
    },

    {
      id: "llm",
      type: "icon",
      data: { label: "LLM", iconName: "bot" },
      position: { x: 260, y: 300 },
    },

    {
      id: "guard",
      type: "icon",
      data: { label: "Parser / Guardrails", iconName: "shield" },
      position: { x: 260, y: 400 },
    },

    {
      id: "orchestrator",
      type: "icon",
      data: { label: "Booking Orchestrator", iconName: "git-branch" },
      position: { x: -20, y: 500 },
    },
    {
      id: "recs",
      type: "icon",
      data: { label: "Recommender", iconName: "star" },
      position: { x: 260, y: 500 },
    },
    {
      id: "q_out_clar",
      type: "icon",
      data: { label: "Return: clarify", iconName: "arrow" },
      position: { x: 500, y: 500 },
    },

    {
      id: "exec",
      type: "icon",
      data: { label: "Action Executor", iconName: "cog" },
      position: { x: -20, y: 600 },
    },
    {
      id: "out_rec",
      type: "icon",
      data: { label: "Return: recommend", iconName: "star" },
      position: { x: 260, y: 600 },
    },
    {
      id: "out_passthru",
      type: "icon",
      data: { label: "Return: AI response", iconName: "arrow" },
      position: { x: 500, y: 600 },
    },

    {
      id: "out_ok",
      type: "icon",
      data: { label: "Return: booking_action_executed", iconName: "check" },
      position: { x: -20, y: 700 },
    },
  ];

  const highlightStyle = {
    stroke: "#2563eb",
    strokeWidth: 2,
    strokeDasharray: "4 2",
  } as React.CSSProperties;

  const fadedStyle = {
    stroke: "#9ca3af",
    strokeWidth: 1,
    opacity: 0.3,
  } as React.CSSProperties;

  const combinedEdges: BasicEdge[] = [
    {
      id: "c1",
      source: "in_user",
      target: "prompt",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },
    { id: "c2", source: "in_image", target: "prompt", style: fadedStyle },
    {
      id: "c3",
      source: "catalogue",
      target: "prompt",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },
    {
      id: "c4",
      source: "bookings",
      target: "prompt",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },

    {
      id: "c5",
      source: "prompt",
      target: "llm",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },
    {
      id: "c6",
      source: "llm",
      target: "guard",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },

    {
      id: "c7a",
      source: "guard",
      target: "recs",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },
    { id: "c7b", source: "guard", target: "orchestrator", style: fadedStyle },
    { id: "c7c", source: "guard", target: "q_out_clar", style: fadedStyle },

    {
      id: "c8",
      source: "recs",
      target: "out_rec",
      animated: true,
      style: highlightStyle,
      type: "smoothstep",
    },
    { id: "c9", source: "orchestrator", target: "exec", style: fadedStyle },
    { id: "c10", source: "exec", target: "out_ok", style: fadedStyle },

    { id: "c11", source: "llm", target: "out_passthru", style: fadedStyle },
  ];

  const [nodes, , onNodesChange] = useNodesState(toNodes(combinedNodes));
  const [edges, , onEdgesChange] = useEdgesState(toEdges(combinedEdges));

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <BumiFlowHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 12,
        }}
      >
        <div
          style={{ display: "flex", gap: 12, height: "calc(100vh - 160px)" }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <BumiVideoDemo />
          </div>
          <div
            style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 8 }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              nodesDraggable={false}
              nodeTypes={{ icon: IconNode }}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnDrag={true}
              style={{ width: "100%", height: "100%" }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}
