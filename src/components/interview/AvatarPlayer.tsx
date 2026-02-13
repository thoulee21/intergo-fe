"use client";

import { RTCPlayer } from "@/utils/rtcplayer2.1.3/rtcplayer.esm.js";
import { Alert, Card, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

const { Text } = Typography;

interface AvatarPlayerProps {
  streamUrl: string;
  onError?: (error: Error) => void;
}

export default function AvatarPlayer({
  streamUrl,
  onError,
}: AvatarPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<typeof RTCPlayer>(null);

  const streamUrlRef = useRef<string | null>(null);
  const onErrorRef = useRef(onError);

  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const initPlayer = useCallback(async () => {
    if (playerRef.current && streamUrl === streamUrlRef.current) {
      console.log("播放器已经初始化，无需重复初始化");
      return;
    }

    if (!streamUrl) {
      console.error("没有提供流地址，无法初始化RTCPlayer");
      return;
    }

    streamUrlRef.current = streamUrl;

    if (playerRef.current) {
      try {
        playerRef.current.destroy?.();
        playerRef.current = null;
      } catch (err) {
        console.error("销毁旧RTCPlayer实例失败:", err);
      }
    }

    try {
      setPlayerLoading(true);
      setPlayerError(null);

      playerRef.current = new RTCPlayer();

      playerRef.current
        .on("play", () => {
          setPlayerLoading(false);
          setIsPlaying(true);
        })
        .on("playing", () => {
          setPlayerLoading(false);
          setIsPlaying(true);
        })
        .on("waiting", () => {
          setPlayerLoading(true);
        })
        .on("error", (e: any) => {
          console.error("RTCPlayer error:", e);
          setPlayerError("虚拟人播放失败");
          setPlayerLoading(false);
          setIsPlaying(false);
          onErrorRef.current?.(new Error("RTCPlayer播放失败"));
        })
        .on("not-allowed", () => {
          console.error("RTCPlayer: 触发浏览器限制播放策略，需要用户交互");
          playerRef.current.resume();
        });

      if (streamUrl.startsWith("webrtc://")) {
        playerRef.current.playerType = 6;
        playerRef.current.stream = { streamUrl };
      } else {
        console.error("不支持的流协议，仅支持WebRTC流");
        setPlayerError("不支持的流协议");
        return;
      }

      playerRef.current.videoSize = {
        width: 500,
        height: 500,
      };

      playerRef.current.container = containerRef.current;

      playerRef.current.play();
    } catch (err) {
      console.error("初始化RTCPlayer失败:", err);
      setPlayerError("初始化播放器失败");
      setPlayerLoading(false);
      onErrorRef.current?.(err as Error);
    }
  }, [streamUrl]);

  useEffect(() => {
    if (streamUrl !== streamUrlRef.current) {
      console.log(
        `流地址变化，准备重新初始化播放器: ${streamUrlRef.current} -> ${streamUrl}`,
      );
      setTimeout(() => {
        initPlayer();
      }, 0);
    }
  }, [streamUrl, initPlayer]);

  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    }, 0);

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy?.();
        } catch (err) {
          console.error("销毁RTCPlayer失败:", err);
        }
        playerRef.current = null;
      }

      streamUrlRef.current = null;
      setIsPlaying(false);
      setPlayerLoading(false);
    };
  }, [initPlayer]);

  return (
    <Card
      title="AI面试官"
      className="avatar-player-card"
      styles={{ body: { padding: 0, minHeight: 320 } }}
      extra={isPlaying && <Text type="success">已就绪</Text>}
    >
      <div
        style={{
          position: "relative",
          paddingBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {playerError ? (
          <div style={{ textAlign: "center", width: "80%" }}>
            <Alert
              message="虚拟人加载失败"
              description={playerError}
              type="error"
              showIcon
            />
          </div>
        ) : playerLoading ? (
          <div style={{ textAlign: "center", paddingTop: "10vh" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>
              <Text type="secondary">正在启动AI面试官...</Text>
            </div>
          </div>
        ) : streamUrl ? (
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: 320,
            }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">AI面试官尚未启动</Text>
          </div>
        )}
      </div>
    </Card>
  );
}
