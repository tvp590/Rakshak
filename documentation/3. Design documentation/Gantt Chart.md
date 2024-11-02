# Gantt Chart

```mermaid
gantt
    title Rakshak - Real-Time Weapon Detection System
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Gathering          :a1, 2024-09-26, 2w
    Project Planning                :a2, after a1, 4w
    section Design
    System Architecture Design      :b1, after a2, 2w
    UI/UX Design                    :b2, after b1, 1w
    section Development
    AI Model Training               :c1, after b2, 5w
    Backend Development             :c2, after c1, 4w
    Frontend Development            :c3, after c2, 3w
    Integration                     :c4, after c2, 2w
    section Testing
    Unit Testing                    :d1, after c3, 1w
    Integration Testing             :d2, after d1, 1w
    User Acceptance Testing         :d3, after d2, 1w
    section Deployment
    Deployment to Production        :e1, after d3, 2w
    section Presentation
    Presentation                    :f1, after e1, 1d
    section Maintenance
    Post-Deployment Support         :f1, after e1, 3w
