"use client";

import { Spin, theme } from "antd";
import { motion } from "framer-motion";
import { useEffect } from "react";
import styles from "./LoadingPathAnimation.module.css";

interface LoadingPathAnimationProps {
  visible: boolean;
  progress: number; 
  onComplete: () => void; 
}

const milestones = [
  "分析面试历史",
  "识别知识点",
  "创建学习路径",
  "生成学习计划",
  "优化学习步骤",
];

const LoadingPathAnimation: React.FC<LoadingPathAnimationProps> = ({
  visible,
  progress,
  onComplete,
}) => {
  const { token } = theme.useToken();

  const totalSteps = milestones.length;
  const activeIndex = Math.floor((progress / 100) * totalSteps);

  useEffect(() => {
    if (!visible) return;

    if (progress >= 90 && activeIndex === totalSteps) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [visible, progress, activeIndex, onComplete, totalSteps]);

  if (!visible) return null;

  return (
    <div className={styles.loadingContainer}>
      <motion.div
        className={styles.loadingCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: token.colorBgContainer }}
      >
        <div className={styles.spinnerSection}>
          <Spin size="large" />
        </div>
        <h2 className={styles.loadingTitle}>正在生成学习路径规划</h2>{" "}
        <div className={styles.pathProgress}>
          <div
            className={styles.pathLine}
            style={{
              width: `${Math.min(((activeIndex + 1) / milestones.length) * 100, 100)}%`,
              transition: "width 1.5s ease-in-out",
            }}
          ></div>
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className={`${styles.milestone} ${index <= activeIndex ? styles.active : ""}`}
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: index <= activeIndex ? 1 : 0.5,
                scale: index <= activeIndex ? 1 : 0.9,
              }}
              transition={{ duration: 1.2 }}
            >
              <motion.div
                className={styles.milestonePoint}
                initial={{ scale: 0 }}
                animate={{
                  scale: index <= activeIndex ? 1 : 0.6,
                  backgroundColor: index <= activeIndex ? "#1890ff" : "#d9d9d9",
                }}
                transition={{ duration: 0.8 }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index <= activeIndex ? 1 : 0.7,
                  color: index <= activeIndex ? "#333" : "#999",
                }}
                transition={{ duration: 0.8 }}
              >
                {milestone}
              </motion.p>
            </motion.div>
          ))}
        </div>
        <motion.p
          className={styles.loadingMessage}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          AI 正在创建个性化学习路径，请稍候...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingPathAnimation;
