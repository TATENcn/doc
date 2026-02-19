---
title: 容器编排系统简单介绍
description: 简单介绍 Kubernetes 容器编排系统
---

集群的组件主要分为`控制平面组件`和`节点组件`.也就是`master`和`worker`.master内部主要有:kube-apiserver、kube-controller-manager、cloud-controller-manager、kube-scheduler和etcd
worker内部主要有:kubelet、kube-proxy和container-runtime

## Master

### kube-apiserver

是 Kubernetes 控制平面的前端，提供 RESTful API 接口，是所有组件（包括用户、kubectl、其他控制平面组件、kubelet、kube-proxy 等）与集群通信的唯一入口。

- 负责认证（Authentication）、授权（Authorization）、准入控制（Admission Control）。
- 所有对集群状态的读写操作都必须通过它。
- 支持水平扩展以提高可用性和性能。

### kube-controller-manager

运行控制器（Controllers），这些控制器通过监控集群状态（通过 apiserver）并使当前状态向期望状态收敛。
**常见控制器包括**：

- Node Controller（处理节点宕机）
- Replication Controller / ReplicaSet Controller（维持 Pod 副本数）
- Endpoint Controller（维护 Service 与 Pod 的映射）
- Namespace Controller、ServiceAccount Controller 等
  将多个控制器逻辑整合到一个二进制进程中，便于部署和管理。

### cloud-controller-manager

用于与底层云平台（如 AWS、GCP、Azure、OpenStack 等）交互，将云厂商特定的控制逻辑从核心 Kubernetes 代码中解耦。
**包含的控制器示例**：

- Node Controller（更新节点信息，如云上的实例状态）
- Route Controller（配置云路由）
- Service Controller（创建云负载均衡器，如 ELB）
  只在使用云提供商时才需要启用,是 Kubernetes 实现“可移植性”的关键设计之一。
  **不是所有集群都启用 cloud-controller-manager**（例如裸金属或本地集群可能不需要）。

### kube-scheduler

负责将新创建的 Pod 调度（绑定）到合适的节点上运行。

### etcd

是 Kubernetes 的**唯一事实来源（single source of truth）**，以键值对形式存储整个集群的状态（如 Pod、Service、Node、ConfigMap 等对象的元数据）。

- 是一个高可用、强一致性的分布式键值存储系统（基于 Raft 协议）。
- **虽然 etcd 通常部署在控制平面节点上，但它本身并不是 Kubernetes 的组件，而是独立项目（由 CoreOS 开发，现属 CNCF）**。
- 生产环境中建议 etcd 集群独立部署或至少与控制平面组件隔离以提高稳定性。
  严格来说，etcd 不属于 Kubernetes 的“组件”，而是其依赖的外部存储系统。但在架构图中常被归入控制平面。

## Worker

### kubelet

运行在每个工作节点上，负责管理该节点上的 Pod 和容器。
**具体职责包括**：

- 从 apiserver 获取分配给本节点的 PodSpec
- 启动/停止容器（通过 CRI 与 container runtime 交互）
- 健康检查（liveness/readiness probes）
- 上报节点和 Pod 状态
  是节点上最重要的代理，直接与容器运行时通信,不通过 API Server 创建的 Pod（如静态 Pod）也由 kubelet 管理。

### kube-proxy

维护节点上的网络规则，实现 Kubernetes Service 的集群内网络访问（ClusterIP、NodePort 等）。
**实现方式**：

- **iptables 模式**（默认）：通过 iptables 规则做 DNAT
- **ipvs 模式**：更高性能，支持更多负载均衡算法
- **userspace 模式**（已弃用）
  注意,kube-proxy不处理 Pod 到 Pod 的直接通信（那是 CNI 插件的职责）,只负责 Service 的流量转发。

### container-runtime

负责拉取镜像、运行和管理容器的生命周期。
**常见实现**：

- Docker（通过 dockershim，K8s v1.20+ 已弃用）
- containerd（推荐）
- CRI-O（轻量级，专为 Kubernetes 设计）
  Kubernetes 通过 **CRI（Container Runtime Interface）** 与运行时解耦,必须兼容 CRI 标准才能被 kubelet 使用。

![image.png](https://bu.dusays.com/2026/02/19/6996fa6d60c83.png)

本文仅作简单参考,详情查看[官方文档](https://kubernetes.io/zh-cn/docs/concepts/architecture/)、知乎[Kubernetes 架构：权威指南（2025）](https://zhuanlan.zhihu.com/p/1940575054430699653)
