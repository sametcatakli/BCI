# BE-INVESTOR: A Modern RSCA Platform  

## Introduction  
BE-INVESTOR is a Belgian application developed by **Samet Catakli** and **Bodjona Kevin** as part of the **ETH OXFORD 2025 hackathon**.  
Built on **Next.js** and leveraging the **XRPL blockchain** with the **RLUSD** currency, it modernizes the concept of tontines by providing a **secure and innovative digital solution**.

## Description  
BE-INVESTOR is based on the **Rotating Savings and Credit Association (RSCA)**, a collective savings and investment model widely used in **Asia, Africa, and immigrant communities in the West**.  
This system promotes collective savings and investments without banks or interest, ensuring **security and transparency** through predefined rules.  

The platform enables **aspiring and experienced entrepreneurs** to invest in each other's projects by joining **secure tontines managed by smart contracts on XRPL**.

---

## Key Features  

### 1. Tontine Creation  
- Define key parameters: **contribution amount, payment frequency, number of participants, withdrawal rules**.  
- The **Tontine Master** is responsible for managing the group.  

### 2. Joining a Tontine  
- Users can join a tontine under specific conditions (**amount, payment frequency, approval by the Tontine Master**).  
- Funds are converted into **RLUSD** and managed via **XRPL** to ensure transaction transparency.  

### 3. Payment Tracking and Management  
- **Real-time dashboard** for monitoring payments.  
- **Color-coded system**: Green for up-to-date payments, red for delays.  
- Transactions are **immutable and secured** via XRPL.  

### 4. Exiting a Tontine  
- Members can leave a tontine under predefined conditions.  
- A **smart contract** ensures compliance with exit terms and fund redistribution.  

### 5. Interactive Dashboard  
- Centralized view of **active and past tontines**.  
- **Statistics** on contributions, payments, and potential earnings.  
- **Secure messaging system** for communication between members.  

---

## Benefits and Added Value  
- **Mutual support and solidarity**: Encourages collective investment.  
- **Accessibility**: No need for a bank account or complex guarantees.  
- **No interest**: An alternative to traditional loans with no extra costs.  
- **Flexibility**: Customizable parameters based on participants' needs.  
- **Enhanced security**: XRPL ensures transaction transparency and reliability.  

**BE-INVESTOR** emphasizes **transparency, collaboration, and accountability**, offering entrepreneurs an innovative tool to **realize their projects through the strength of a group**.

---

## Technical Functioning (Samet’s Contribution)  

### Tontine Fund Management  
- A **temporary wallet** is created for each tontine, acting as a deposit account.  
- Upon creation, a **beneficiary address** and an **expiration date** must be specified.  
- A **trustline transaction** is automatically executed with the beneficiary’s address to prevent future transaction issues.  

### Automated Tontine Closure  
- A **crontab** runs **every minute** to close expired tontines.  
- The **total balance** of the tontine wallet is transferred **to the beneficiary’s address**.  
- Currently, manual closure is available via a button.  

### Future Enhancements  
- **Continuous tontines**: Instead of closing, the balance can be transferred to the next contributor.  
- **Full automation**: Transition from manual closure to a fully automated crontab system.  

---

## Conclusion  
BE-INVESTOR **revolutionizes the traditional tontine system** by providing a **modern, transparent, and secure blockchain solution**.  
It enables **entrepreneurs and investors** to collaborate **without intermediaries**, ensuring **efficient fund management and fair redistribution**.

**An innovative project empowering collective investment!**  
