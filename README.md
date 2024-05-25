# Military Base Scanner Project
[Robot Image](!https://github.com/GamesProSeif/military-scanner-project/blob/main/Robot.png?raw=true)
## Introduction
The Military Base Scanner project aims to revolutionize reconnaissance missions by leveraging a Radio-Controlled (RC) car equipped with advanced sensors and machine learning (ML) technology. This project addresses the critical need for precise and safe data collection on enemy bases, providing detailed maps of enemy positions and equipment without endangering human operatives.

## Problem Statement
Military operations often require detailed reconnaissance to understand enemy base layouts, including unknown quantities of soldiers, restock stations, and defensive equipment. Traditional reconnaissance methods pose significant risks to human life. The Military Base Scanner project proposes a safer alternative using an RC car to gather and transmit essential data.

## Objective
Develop an RC scanner car capable of conducting detailed reconnaissance missions, capturing and transmitting data to a remote computer. The primary goal is to provide highly accurate mapping of enemy bases, significantly reducing the need for direct human involvement in dangerous reconnaissance missions.

## Proposed Solution

### RC Scanner Car Design
The RC car is designed to be compact and versatile, equipped with various sensors and cameras to navigate through enemy bases and capture critical data.

### System Components
1. **Camera**:
   - **Role**: Serves as an input for a machine learning classifier.
   - **Function**: Detects and identifies soldiers, turrets, and restock stations.

2. **Ultrasonic Sensor**:
   - **Role**: Measures distance to surrounding structures.
   - **Function**: Assists in navigation and mapping of walls, buildings, and obstacles.

3. **Inertial Measurement Unit (IMU)**:
   - **Role**: Reads the rotation angle of the car.
   - **Function**: Corrects errors from turning motors to ensure accurate navigation.

## Process Diagram
[Include a diagram showing the process flow of the RC car from data collection to transmission and map generation]

## Project Timeline and Milestones
- **Week 10**: Acquiring the RC car.
- **Week 11**: Adding ultrasonic sensor and IMU to the car and sending the data to the receiver API.
- **Week 12**: Developing software to parse received data and generate a map.
- **Week 13**: Building the ML classifier and integrating it with the software.

## Cost Analysis
- **420 EGP**: Body Kit & Motors & Wheels
- **250 EGP**: ESP8266
- **90 EGP**: Ultrasonic Sensors
- **135 EGP**: IMU
- **75 EGP**: Breadboard
- **225 EGP**: Battery & Holder
- **85 EGP**: Motor Driver
- **Total**: 1280 EGP

## Results/Findings
The Military Base Scanner provides highly accurate mapping of enemy bases, identifying critical components like soldiers and equipment. Extensive testing in various simulated environments has validated the system's reliability and precision.

## Conclusion
The Military Base Scanner is a revolutionary military technology that uses advanced sensors and machine learning to provide crucial battlefield intelligence without human risk. It significantly enhances the safety of military personnel by enabling remote data collection.

## Future Recommendations
- **Improvements**: Include additional sensors for better environmental understanding and more robust ML algorithms for improved object detection.
- **Applications**: Adapt the technology for various reconnaissance missions beyond military use, such as search and rescue operations.

## Team Members
- Salah Elshafey
- Seif Mansour
- Kareem Aboelazm
