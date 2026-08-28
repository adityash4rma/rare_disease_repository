CREATE TABLE IF NOT EXISTS patient_clinical_records (
    Systolic_BP_mmHg FLOAT,
    Diastolic_BP_mmHg FLOAT,
    Heart_Rate_bpm FLOAT,
    Body_Temp_Celsius FLOAT,
    BMI FLOAT,
    Hemoglobin_g_dL FLOAT,
    WBC_Count_cells_mcL FLOAT,
    Platelet_Count_cells_mcL FLOAT,
    Serum_Creatinine_mg_dL FLOAT,
    ALT_U_L FLOAT,
    Clinical_Outcome_Target VARCHAR(50)
);

-- Seed at least 10–20 test rows per node
INSERT INTO patient_clinical_records VALUES 
(120, 80, 72, 36.6, 22.5, 14.0, 6500, 250000, 0.9, 25, 'High Risk'),
(115, 75, 68, 36.5, 21.0, 13.5, 5800, 230000, 0.8, 20, 'Stable');
