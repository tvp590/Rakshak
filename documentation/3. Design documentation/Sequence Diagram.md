```mermaid
sequenceDiagram
    participant MonitoringTeam as Monitoring Team
    participant SurveillanceSystem as Surveillance System
    participant AIModel as AI Model
    participant Dashboard as Dashboard
    participant SecurityTeam as Security Team
    participant Database as Database

    MonitoringTeam->>SurveillanceSystem: Start CCTV Feed Monitoring
    loop Continuous Monitoring
        SurveillanceSystem->>AIModel: Send CCTV Feed for Analysis
        AIModel->>AIModel: Analyze CCTV Feed
        AIModel-->>SurveillanceSystem: Send Analysis Results
        alt No Weapon Detected
            SurveillanceSystem->>Dashboard: Continue Showing CCTV Feed
        else Weapon Detected
            SurveillanceSystem->>MonitoringTeam: Display Alert with Detected Weapon and Location Information
            SurveillanceSystem->>SecurityTeam: Send Alert Notification
            SurveillanceSystem->>MonitoringTeam: Request to Confirm Alert Level
            MonitoringTeam-->>SurveillanceSystem: Confirm Alert Level
            alt Known Security Personnel with Weapon - Low Priority Alert
                SurveillanceSystem->>Dashboard: Display Low Priority Alert for a Few Minutes
                SurveillanceSystem-->>SecurityTeam: Send Low Priority Alert Notification
                MonitoringTeam-->>SecurityTeam: Request to Ignore
            else Civilian or Unknown Security Personnel with Weapon - High Priority Alert
                SurveillanceSystem->>Dashboard: Display High Priority Alert with Detected Weapon and Location Information
                SurveillanceSystem-->>SecurityTeam: Send High Priority Alert Notification
                MonitoringTeam-->>SecurityTeam: Coordinate and Decide Further Action
            end
            MonitoringTeam-->>Database: Log the Incident with Respective Alert Level
        end
    end
