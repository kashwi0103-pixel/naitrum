# DR-Sahayak District-Scale System Simulation

This directory contains the simulation scripts for the DR-Sahayak system, designed to model a district-scale deployment of diabetic retinopathy screening.

## Purpose

The simulation demonstrates whether the system can scale to handle 100,000+ patients per year, identifying bottlenecks in:
- Camera throughput at Primary Health Centers (PHCs)
- AI Server capacity
- Network bandwidth (Upload delay)
- Ophthalmologist availability (Doctor queue)

## Files Included

1. `run_simulation.m`: A MATLAB script containing the queuing theory logic for estimating throughput, queue length, and resource utilization. This acts as the mathematical backbone.
2. `README.md`: This instruction file.

## Constructing the `.slx` SimEvents Model

To provide a visual, interactive demonstration to SIH judges, you should create a true SimEvents `.slx` model using MATLAB's Simulink interface. 

### Recommended Block Structure

1. **Patient Generator**: Use an `Entity Generator` block to simulate patient arrivals. Set the intergeneration time based on the `patientsPerYear` parameter.
2. **Camera Acquisition**: Route entities to an `Entity Server` representing the Fundus Cameras. The service time should be ~10 minutes. Set the server capacity to the number of cameras.
3. **Network Transmission**: Route entities to a secondary `Entity Server` representing upload time (inversely proportional to bandwidth).
4. **AI Processing Queue**: Use a queue block before the AI `Entity Server`. Service time ~2 seconds per image.
5. **Referable DR Router**: Use an `Entity Output Switch`. Generate a random variable for each entity; route ~20% of entities to the Specialist Queue.
6. **Specialist Queue**: Route the referable cases to an `Entity Server` representing the Ophthalmologists. Set capacity to the number of doctors, service time to `doctorReviewTime` (e.g., 5-10 mins).
7. **Scopes/Dashboards**: Attach `Dashboard Scope` blocks to observe queue lengths and utilizations in real-time.

### Connecting to Node/FastAPI

The FastAPI backend currently returns results from a mock equivalent of this simulation (`/api/simulation/run`). 

When MATLAB is installed locally and you have the `matlabengine` Python package, uncomment the integration lines in `backend/main.py`:
```python
import matlab.engine
eng = matlab.engine.start_matlab()
# Call the MATLAB script or the SLX model directly
results = eng.run_simulation(...) 
```
