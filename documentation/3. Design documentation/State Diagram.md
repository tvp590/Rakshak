# State Diagram

```mermaid
stateDiagram

    state "Idle" as s1
    state "Start Surveillance" as s2
    state "Analyzing CCTV Feed" as s3
    state "Trigger Alert" as s4
    state "Store Video" as s5
    state "Update Dashboard" as s6
    state "Notifying Security" as s7
    state "Evaluating Alert" as s8
    state "Logging False Positive" as s9
    state "Coordinating with Security" as s10
    state "Response In Progress" as s11
    state if_state <<choice>>
    state fork_state <<fork>>
    state if_state_2 <<choice>>
    state if_state_3 <<choice>>
    state join_state <<join>>

    [*] --> s1
    s1 --> s2: Monitoring Team/Individual
    s2 --> s3: AI Model
    s3 --> if_state
    if_state --> s2 : No Weapon Detected
    if_state --> s4 : Weapon Detected
    s4 --> fork_state
    fork_state --> s6 : Show Alert with picture of weapon and location
    fork_state --> s7
    s6 -->if_state_2
    if_state_2 -->s9 : False Positive
    if_state_2 -->s8 : True Positive
    s9 --> s10: Not a Threat. Don't proceed
    s10 --> s2: Continue Monitoring
    s8 --> if_state_3
    if_state_3 -->s10 : Known Security with weapon is not a threat
    if_state_3 -->join_state : Civilian or unknown security with weapon is a threat
    s7 --> join_state
    join_state --> s11 : Proceed to investigate
    join_state --> s5  : Log incident in database
    s11 -->[*]
    

    

