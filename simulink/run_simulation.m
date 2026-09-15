% DR-Sahayak System Capacity Simulation
% This script runs the queuing theory simulation for the DR-Sahayak system.
% In a full SimEvents model, this script would initialize variables and
% call sim('DR_System_Model.slx').

function results = run_simulation(patientsPerYear, phcs, cameras, bandwidth, aiCapacity, ophthalmologists, doctorReviewTime)
    % Simulation Constants
    workingDays = 250;
    hoursPerDay = 8;
    minutesPerDay = hoursPerDay * 60;
    secondsPerDay = minutesPerDay * 60;
    
    patientsPerDay = patientsPerYear / workingDays;
    
    % 1. Image Acquisition Capacity
    % Assuming 10 minutes per patient screening
    timePerScreeningMin = 10;
    cameraCapacityPerDay = cameras * (minutesPerDay / timePerScreeningMin);
    cameraUtilization = (patientsPerDay / cameraCapacityPerDay) * 100;
    if cameraUtilization > 100, cameraUtilization = 100; end
    
    % 2. AI Processing Capacity
    % AI capacity given in inferences per second
    inferencesPerSecond = 0.5; % 2 seconds per inference
    aiCapacityPerDay = aiCapacity * inferencesPerSecond * secondsPerDay;
    aiUtilization = (patientsPerDay / aiCapacityPerDay) * 100;
    if aiUtilization > 100, aiUtilization = 100; end
    
    % 3. Network Delay / Bandwidth
    % Baseline bandwidth handles 50 Mbps without delay
    networkUtilization = (50 / bandwidth) * 100;
    if networkUtilization > 100, networkUtilization = 100; end
    
    % 4. Specialist Review Capacity
    % Assuming ~20% of patients require doctor review (Referable DR)
    referralRate = 0.20;
    referablePatientsPerDay = patientsPerDay * referralRate;
    
    doctorCapacityPerDay = ophthalmologists * (minutesPerDay / doctorReviewTime);
    doctorUtilization = (referablePatientsPerDay / doctorCapacityPerDay) * 100;
    if doctorUtilization > 100, doctorUtilization = 100; end
    
    % 5. Bottleneck Analysis
    utils = struct('Camera', cameraUtilization, ...
                   'AI', aiUtilization, ...
                   'Ophthalmologists', doctorUtilization, ...
                   'Network', networkUtilization);
               
    fields = fieldnames(utils);
    maxUtil = 0;
    bottleneck = '';
    for i = 1:numel(fields)
        if utils.(fields{i}) > maxUtil
            maxUtil = utils.(fields{i});
            bottleneck = fields{i};
        end
    end
    
    % 6. Queue and Throughput Estimates
    peakQueue = max(0, (maxUtil - 100) * 50);
    waitingTime = max(5, (maxUtil / 100) * 15);
    
    if maxUtil <= 100
        processed = patientsPerYear;
        sufficient = true;
    else
        processed = round(patientsPerYear * (100 / maxUtil));
        sufficient = false;
    end
    
    % 7. Output Results
    results = struct(...
        'totalPatients', patientsPerYear, ...
        'processed', processed, ...
        'waiting', patientsPerYear - processed, ...
        'throughput', round(processed / workingDays), ...
        'avgWaitingTime', waitingTime, ...
        'peakQueue', peakQueue, ...
        'cameraUtilization', cameraUtilization, ...
        'aiUtilization', aiUtilization, ...
        'doctorUtilization', doctorUtilization, ...
        'bottleneck', bottleneck, ...
        'sufficient', sufficient ...
    );

    fprintf('--- Simulation Results ---\n');
    fprintf('Throughput: %d patients/day\n', results.throughput);
    fprintf('Bottleneck: %s\n', results.bottleneck);
    fprintf('Sufficient Capacity: %d\n', results.sufficient);
end
