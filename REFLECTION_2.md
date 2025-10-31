# **Phase 2 Reflection**

## **What Went Well**
Our MVP successfully identifies potential phishing scams and alerts users in real time. The development process moved faster than expected, and we were pleasantly surprised by how quickly we went from concept to a working prototype. Once we defined the flow between **content → background → popup** and committed to **in-memory storage** for site data, everything clicked. The architecture felt intuitive and easy to adjust.  

Getting the **SSL check** and **PhishTank verification** to trigger a real-time UI change—specifically, the red banner on dangerous pages—was incredibly satisfying. It felt like we were building something genuinely useful, not just fulfilling a class requirement.  

A major success was our discovery and integration of existing APIs providing phishing intelligence. In particular, the **PhishTank API** and **SSL Labs API** proved invaluable, allowing us to verify website safety efficiently and accurately. These resources not only enhanced our detection capabilities but also revealed opportunities for future expansion. By leveraging these APIs, our MVP achieved reliable phishing detection without reinventing the wheel.

## **What Failed or Changed — and What We Learned**
One of the most unexpected challenges we faced involved managing **multiple browser tabs**. Initially, our MVP performed well on a single tab, but when users switched tabs, the data from one would overwrite the other, causing previous results to disappear. We realized this issue stemmed from how we were storing and updating tab-specific data.  

To fix it, we restructured our data handling and process execution logic to ensure persistence across tabs. This was a key lesson: **testing and iteration reveal what design alone cannot.** Bugs like these only surface through active prototyping, and discovering them helped us strengthen our overall approach.  

We also ran into a few smaller but memorable hiccups along the way:
- The **architecture diagram** took far longer than expected—we had to get up to speed with Lucidchart quickly.  
- Our **communication flow planning** went through multiple revisions before we settled on a clean message contract (`{ action: "getData" }` and `{ action: "showWarning" }`) that worked seamlessly between the service worker, popup, and content scripts.  
- **PowerShell and Git setup** was more frustrating than expected, though teamwork (and “winget install git”) saved the day.  

Altogether, these experiences reinforced the importance of strong tool familiarity and consistent documentation.  

## **Did Building a Prototype Change How We View the Problem?**
During development, we realized the problem wasn’t that users *can’t* determine whether a website is malicious—it’s that they *don’t*. Most people won’t go out of their way to check a site’s credibility before interacting with it. The real challenge, therefore, lies in **making security effortless**.  

This insight shifted our focus. Instead of asking *“How can we determine if a website is phishing?”*, we began asking *“How can we make this process automatic and intuitive for users?”* The Chrome extension format solved this elegantly, allowing our tool to provide real-time alerts and contextual information—such as SSL status, blacklist checks, and trust indicators—without any manual input.  

In short, we learned that **usability is as critical as accuracy**. A powerful phishing detector means little if users don’t engage with it.

## **Updated Plan for Phase 3**
Following the MVP’s success, we’ve identified several areas for improvement and next steps as we move into Phase 3:

| **Change** | **Reason** |
| :-- | :-- |
| **Integrate additional APIs** | There are numerous APIs providing phishing and threat intelligence data. Incorporating more will allow us to cross-verify results and improve detection accuracy. |
| **Rebuild in Python** | Our lead developer noted that Python offers clearer structure, better debugging, and easier integration for local and server-side expansion. |
| **Parallelize documentation** | We plan to document code changes as we develop, rather than retrofitting documentation after the fact. This will streamline updates and improve project clarity. |

In Phase 3, we plan to **enhance our detection model** by integrating more APIs and potentially transitioning to a **local Python-based implementation**. This shift will make our project more scalable and adaptable beyond the browser extension environment.  

We also intend to strengthen detection of **new or emerging phishing sites** that haven’t yet been listed in public databases. While our current heuristics are effective, adding more data-driven methods—such as heuristic patterning, machine learning scoring, and cloud analytics—will help us detect zero-day phishing attempts faster and more accurately.  

Ultimately, our prototype has shown that users don’t just need a tool that flags dangerous websites—they need one that empowers them with context and confidence. That’s the direction we plan to take moving forward.
