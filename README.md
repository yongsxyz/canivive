# **Canivive - Web3 MMORPG Survival Sandbox Adventure**

**Canivive** is an MMORPG Survival Sandbox Adventure game that blends PvP, PvE, and Play-to-Earn (P2E) elements within an open-world blockchain environment. Players choose one of two main factions and strive to survive while building, exploring, gathering, refining, fighting, and trading..


website : canivive.xyz
canister : -
openchat : https://oc.app/group/hznfs-bqaaa-aaaac-aqtla-cai/
x : https://x.com/canivive

---

![Canister (1)](https://github.com/user-attachments/assets/b3f234f4-e41e-425d-b3f0-21e414e7ab47)


## 🧱 Key Modules Breakdown

| Module          | Tech                              | Description |
|------------------|-----------------------------------|-------------|
| 🎮 Game Engine   | Three.js + ECS                    | Renders 3D world and runs logic on browser |
| 🌐 Multiplayer    | WebSocket                         | Real-time communication between players |
| 🧠 Game Server    | Node.js / Rust                    | Enforces world rules and synchronizes state |
| 🔗 Blockchain     | Internet Computer (ICP)           | Handles on-chain logic: NFTs, economy, identity |
| 📦 Storage        | IPFS / ICP                        | Stores assets like 3D models, textures, metadata |
| 🏪 Marketplace    | Canister Smart Contracts          | Peer-to-peer trading of NFTs and items |
| 🎨 UI/UX Layer    | React + Tailwind CSS              | Responsive, modern web interface for game menus, inventory, trading, and user onboarding |

---

## 🛡️ Security & Ownership

- **Fully on-chain assets**: Prevents item duplication or unauthorized control.
- **No server = no single point of failure**: Land, items, and economy live on-chain.
- **Decentralized identity**: Player login via wallet; no email/password required.

---

## 📲 Cross-Platform Support

- **Web-first, responsive UI** built with Tailwind + React
- **Lightweight assets** optimized for low-end mobile and desktop
- **Future support for PWA (Progressive Web App)**



## **Why?**

Browser-based games are fun, but many rely on Unity WebGL exports, which tend to be heavy and slow, especially on low-spec devices.

To solve this, we're building a lightweight, modular browser-based multiplayer game engine using **Three.js** and a custom-built **Entity-Component-System (ECS)**. This approach enables:

- Fast-loading gameplay  
- Flexible and maintainable architecture  
- Responsive in-browser player experience  

### **ICP Canister Integration**

This project also aims to **directly integrate Canisters** from the Internet Computer (ICP) into the game's architecture to:

- Store all critical data (NFTs, tokens, items, economy) fully **on-chain**  
- Guarantee **true, transparent, and secure digital ownership**  
- Enable a **decentralized game ecosystem**, independent of traditional servers  

> This project is not just about building a game — it's about redefining how browser-based multiplayer games can be developed and operated in the Web3 era.

---

## **The Problem**

- ⚠️ Traditional MMORPGs often focus on grinding mechanics with no real-world economic value.  
- ⚠️ Many blockchain games lack depth in gameplay and are overly focused on token speculation.  
- ⚠️ Poor balance between F2P, P2E, and P2P models, making non-paying players feel left out.  
- ⚠️ Minimal full on-chain integration for NFTs and utility tokens in game economies.  

---

## **Our Solution**

- **Survival & Sandbox Core**: Players have different goals and complete freedom.  
- **Dual-token Economy**:  
  - **Gold** for in-game economy  
  - **CNV (Canivive)** for broader ecosystem  
- **Faction Wars, Looting, Crafting, PvP/PvE** to encourage interaction and competition  
- **Fully On-Chain NFTs & Tokens** for transparent and secure item/land ownership  
- **Fair Freemium Model**: Free for everyone, but premium users get **time-saving** advantages, not exclusive power.

---

## **🔑 Key Features**

### 🎯 Character Progression System  
Level up by defeating monsters or through gathering, crafting, and refining.

### ⚔️ Two Major Factions  
Join one and dominate large-scale PvP wars and territory control strategies.

### ☠️ Red Zone Death Penalty  
Die in a Red Zone, and your items may drop and be looted by others.

### 💰 Looting & Storage System  
Collect treasures from enemies, dungeons, and chests, and manage them via your personal storage.

### 🌾 Farming & Land Ownership  
Own and cultivate your own land for farming or building structures.

### 🔄 Trading Marketplace  
Engage in peer-to-peer trading with a dynamic in-game marketplace.

### 🧪 Buff Systems  
Use potions, food, and special items to gain combat, crafting, or gathering buffs.

### 📆 Daily Reset Quest System  
Global daily quests where players sell items to NPCs at system-defined prices.  
- Gold is minted on-chain.

### 👾 NFT Integration  
Unique, tradable NFTs for character skins, enchanted items, and land.

### 💎 Subscription (Premium) Model  
Premium players get:
- XP Boost  
- Crafting & Refining Bonuses  
- Reduced Taxes  
- Increased Efficiency


> Features will expand with continuous updates, new content, and community-driven systems.

---

## **🛠 Architecture**

### **Client-Server Architecture**
- Authoritative multiplayer server  
- Shared codebase between client and server (for gameplay replication)

### **ICP Canister Integration**
- Full on-chain NFT management  
- Tokenized game economy

### **Cross-Platform UI**
- Optimized for both mobile and desktop  
- Lightweight **Low Poly Assets** for high performance

### **Blockchain-based In-game Economy**
- Gold is only minted through NPC quest systems  
- **Limited Supply** maintained via smart contracts  
- Looted items can be sold to NPCs  
- Prices dynamically determined by the system  
- All minting transactions recorded on-chain to maintain economic balance
