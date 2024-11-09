# System architecture

```mermaid
architecture-beta
    %% Define the main groups
    group external_system(cloud)[External System]
    group rakshak_system(cloud)[Rakshak System]

    %% Define services within groups
    service cctv(disk)[CCTV Cameras] in external_system
    service server(server)[Server] in rakshak_system
    service ai_model(database)[AI Weapon Detection Model] in rakshak_system
    service database(database)[Database] in rakshak_system
    service dashboard(server)[User Dashboard] in rakshak_system
    service alert(disk)[Alert Notification] in rakshak_system
    service security_team(server)[Security Team] in external_system

    %% Define junctions for potential splits
    junction junctionProcessing

    %% Define edges to connect services
    cctv:R -- L:server
    server:T -- B:ai_model
    server:R -- L:database
    server:B -- T:alert
    alert:R -- L:dashboard
    alert:L -- R:security_team
    server:L -- R:dashboard
    

    %% Connect junctions for visual clarity
    junctionProcessing:R -- L:server

