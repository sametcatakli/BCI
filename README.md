# BE-INVESTOR : Une plateforme RSCA moderne  

## Introduction  
BE-INVESTOR est une application belge développée par **Samet Catakli** et **Bodjona Kevin** dans le cadre du **hackathon ETH OXFORD 2025**.  
Basée sur **Next.js** et exploitant la **blockchain XRPL** avec la monnaie **RLUSD**, elle modernise le concept de la tontine en apportant une solution **numérique innovante et sécurisée**.

## Description  
BE-INVESTOR repose sur le principe du **Rotating Savings and Credit Association (RSCA)**, un modèle d’épargne et d’investissement collectif utilisé en **Asie, Afrique et parmi les communautés d’immigrés**.  
Ce système favorise l’épargne sans intermédiaire bancaire ni intérêt, en garantissant **sécurité et transparence** via la blockchain.

L’application permet aux **entrepreneurs** d’investir mutuellement dans leurs projets en rejoignant des **tontines sécurisées**, gérées par **smart contracts sur XRPL**.

---

## Fonctionnalités principales  

### 1. Création de tontine  
- Définition des paramètres clés : **montant, fréquence, participants, règles de retrait**.  
- Le **Tontine Master** est responsable de la gestion du groupe.  

### 2. Adhésion à une tontine  
- Conditions d’entrée définies (**montant, fréquence, validation par le Tontine Master**).  
- Fonds convertis en **RLUSD** et sécurisés via **XRPL**.  

### 3. Suivi et gestion des paiements  
- **Tableau de bord en temps réel**.  
- **Code couleur** : Vert pour paiement à jour, rouge pour retard.  
- Transactions **immutables et sécurisées** via XRPL.  

### 4. Sortie de la tontine  
- Conditions préétablies de départ.  
- **Smart contract** garantissant la redistribution des fonds.  

### 5. Tableau de bord interactif  
- Vue centralisée des **tontines actives et passées**.  
- **Statistiques** sur contributions, paiements et gains.  
- **Messagerie sécurisée** entre membres.  

---

## Avantages et Valeur Ajoutée  
- **Entraide et solidarité** : Favorise l’investissement collectif.  
- **Accessibilité** : Pas besoin de compte bancaire ni garanties complexes.  
- **Sans intérêts** : Alternative aux prêts traditionnels.  
- **Flexibilité** : Paramètres personnalisables.  
- **Sécurité renforcée** : **XRPL** assure la transparence et la fiabilité.  

**BE-INVESTOR** met l’accent sur **transparence, collaboration et responsabilité**, offrant aux entrepreneurs une solution moderne et efficace pour **réaliser leurs projets grâce à la force d’un groupe**.

---

## Fonctionnement technique (Partie Samet)  

### Création et gestion des fonds  
- Un **wallet temporaire** est généré pour chaque tontine, servant de compte dépositaire.  
- Lors de la création, il faut renseigner **une adresse bénéficiaire** et **une date d’échéance**.  
- Une **transaction de trustline automatique** est effectuée avec le bénéficiaire pour éviter les problèmes futurs.  

### Clôture automatique des tontines  
- Un **crontab** (tâche automatisée) tourne **chaque minute** pour clôturer les tontines expirées.  
- Le **solde total** du wallet tontine est transféré **vers le bénéficiaire**.  
- Actuellement, une clôture **manuelle** est disponible via un bouton.  

### Évolutions futures  
- **Tontines continues** : Versement du solde au prochain contributeur au lieu de clôturer.  
- **Automatisation complète** : Passage du système manuel à un crontab actif.  

---

## Conclusion  
BE-INVESTOR révolutionne le **système traditionnel des tontines** en offrant une solution **blockchain moderne, transparente et sécurisée**.  
Elle permet aux **entrepreneurs et investisseurs** de collaborer **sans intermédiaire**, garantissant une **gestion efficace des fonds et une redistribution équitable**.

**Un projet innovant au service de l’investissement collectif !**  
