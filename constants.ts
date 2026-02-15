import { Section } from './types';

// Hardcoded content simulating the database from the provided files
const SECTION_1_CONTENT = `
1. Basic Sciences: Anatomy, Physiology, Pathology, Biochemistry, Pharmacology, Medical Microbiology.
Anatomy: Is the science which deal with the structure of human body parts.
Physiology: Consider with the function of human body parts.
Pathology: Is the study of disease.
Biochemistry: Is the study of the chemical reaction that take place inside organism.
Pharmacology: The science of drugs.
Clinical Sciences: Medicine, Surgery, Pediatrics, Gynecology.
Medicine: A drug used to maintain health.
Surgery: The branch of medicine that employs operation in treatment of disease or injury.
Gynecology: Is the branch of medicine that is particularly concerned with the health of female organs.
Paediatric: Is the branch of medical science that deal with care of childhood.
Sub Specialty: Dermatology, Radiology, Anesthesia, Orthopedics, Ophthalmology, Forensic Medicine.

THE BLOOD
Blood: is vital specialized connective tissue which circulate through the body.
COMPOSITION: Consist of two portions:
1. fluid known as plasma 55%.
2. Cells 45%.

A) Plasma proteins: Albumin, Globulin, Fibrinogen.
1. Albumin: Largest amount of protein. Percentage 55% of blood protein. Function: transport insoluble molecules. Production: liver.
2. Globulin: Percentage 38%. Function: transport iron, hormone, lipid. Production: liver. Or Immunoglobulins (Antibodies) produced by plasma cells.
3. Fibrinogen: Function: Blood coagulation.

B) Cells:
1. Red blood cells (erythrocyte): Life span 120 days. Remove by reticuloendothelium system. Break down to constituents. Contain Hemoglobin (Hb). No granules. Transport oxygen and carbon dioxide. Carry Antigens.
2. Platelets (thrombocyte): Cytoplasmic fragmentation of megakaryocyte in bone marrow. Normal life span 7-10 days. Normal count 150,000 - 450,000. Function: Adhesion to injured vessel, release of biochemicals (epinephrine, serotonin, thromboxane A2, collagen, thrombin), aggregation.
3. White Blood Cells (leukocyte):
   - Granulocytes: Neutrophil (Bacterial infection), Eosinophil (Parasite infection), Basophil (CML).
   - Agranulocytes: Monocyte, Lymphocyte.
`;

const SECTION_2_CONTENT = `
THE ENDOCRINE SYSTEM
The endocrine system consist of:
1. Pituitary gland: At the base of hypothalamus. Divided into Anterior and Posterior.
   - Anterior Hormones: 
     1. Growth Hormone (GH): Single chain.
     2. Prolactin (PRL): Stimulate breast milk production.
     3. Adreno-cortico tropic hormone (ACTH): Stimulates cortisol release by adrenal cortex.
     4. Thyroid Stimulating Hormone (TSH): Controls thyroid hormone production (T3, T4). Glycoprotein.
     5. Follicle stimulating hormone (FSH): Regulates maturation in ovary.
   - Posterior Hormones:
     1. Antidiuretic hormone (ADH): Limits water excretion by kidney. Lack causes diabetes insipidus.
     2. Oxytocin: Stimulates milk flow and uterine contractions.

2. Thyroid gland: Largest gland. Produces Thyroxine (T4) and Triiodothyronine (T3) containing iodine. Lack of iodine causes swelling (Goiter).

3. Adrenal gland: Consist of Cortex and Medulla.
   - Cortex Hormones:
     1. Cortisol: Mobilize fat/amino acids, increase blood glucose.
     2. Aldosterone: Promote reabsorption of sodium, decrease potassium.
     3. Androgen.
   - Medulla Hormones: Catecholamines (80% Adrenaline, 20% Nonadrenaline). Increase heart rate, breakdown glycogen.

4. Pancreas: Contains Islets of Langerhans.
   - Type A cells (20%): Secrete Glucagon (break down glycogen to glucose).
   - Type B cells (60-75%): Secrete Insulin (regulate glucose level, lack causes Diabetes Mellitus).

5. Parathyroid gland: Parathyroid hormone (PTH) raises plasma calcium, decreases phosphate.

6. Kidney hormones: Erythropoietin, Renin, Vitamin D3 activation.
`;

const SECTION_3_CONTENT = `
THE MICROBES
Bacteria: Structure contains plasma membrane, cell wall, capsule, cytoplasm, flagella, DNA, ribosome.
Classification by shape: Cocci (Double, Chain, Cluster), Bacillus, Spirochetes.
Gram stain: Gram positive (blue), Gram negative (red).
Site of entry: Respiratory, GIT, Genital, Skin.

Virus: Smaller than bacteria, obligate intracellular parasite.
Structure: Genome, Capsid (protein), Envelope (optional).
Classification: Phenotype, Nucleic acid type, Mode of replication.

Parasites:
- Malaria (Plasmodium falciparum, vivax, ovale, malariae). Vector: Anopheles mosquito.
- Amebia (Entamoeba histolytica).
- Giardia (Giardia lamblia).
- Trichomonas (Trichomonas vaginalis).
- Toxoplasma (Toxoplasma gondii).
- Leishmania.

THE SKELETON SYSTEM
Bone: Complex living organ made of cells, protein fibers, minerals.
Skull: Superior portion (cranium), Inferior/anterior (facial bones).
Vertebrae: Cervical (7/neck), Thoracic (12/chest), Lumbar (5/lower back), Sacrum (5 fused), Coccyx (4 fused tailbone).
Ribs and Sternum.
Upper Limb: Humerus, Radius, Ulna, Carpal, Metacarpal, Phalanges.
Lower Limb: Femur (largest), Patella, Tibia, Fibula, Tarsal, Metatarsal.
Pelvic Bones: Pubis, Ischium, Ilium.

Joints:
1. Fibrous: Skull sutures.
2. Cartilaginous: Vertebrae.
3. Synovial: Shoulder, Elbow, Wrist, Hip, Knee, Ankle.

Muscles: Skeletal (Striated), Cardiac (Striated), Smooth (Hollow organs).
Skin: Epidermis (Corneal, base line), Dermis (Hair follicles, sweat glands, sebaceous glands, blood vessels, nerves).
`;

const SECTION_4_CONTENT = `
THE RESPIRATORY SYSTEM
Consist of Upper and Lower respiratory tract.
Upper:
- Larynx: Protection, talking, breathing.
- Epiglottis: Flap protecting glottis.
- Trachea: Connects larynx to lung. Protection, vocal sounds.
- Pharynx.

Lower:
- Bronchi: Right and Left.
- Bronchioles.
- Alveoli: Gas exchange. Lined by flat epithelium and granular pneumocytes.

Hypoxia: Oxygen deficiency at tissue level.
Functions: Respiration, Expiration, Ventilation.

GASTRO-INTESTINAL TRACT (Digestive System)
Mouth: Teeth (Mastication), Tongue (Taste, Movement, Swallowing).
Salivary Glands: Moisten food, Lubrication. Secretions: Amylase, Lysozyme, IgA.
Esophagus: Propulsive movement (Peristalsis).
Stomach: Secretion of HCl (kill bacteria), Pepsin (protein digestion), Intrinsic factor (B12 absorption). Parts: Fundus, Body, Pylorus.
Small Intestine: Duodenum (first 25cm), Jejunum (next 2.5m), Ileum (last 3m). Functions: Digestion, Lubrication, Absorption.
Large Intestine: Ascending, Transverse, Descending, Sigmoid colon, Caecum, Anal canal. Functions: Storage, Water absorption, Mucus secretion.
Liver: Largest organ (1.5kg). Synthesis of plasma proteins, clotting factors. Detoxification. Metabolism of drugs. Storage of glucose.
`;

export const SECTIONS: Section[] = [
  {
    id: 'sec1',
    title: 'General Biology & Blood',
    description: 'Introduction to basic medical sciences, branches of biology, and detailed composition and function of blood.',
    content: SECTION_1_CONTENT,
    iconName: 'microscope',
  },
  {
    id: 'sec2',
    title: 'The Endocrine System',
    description: 'Study of hormones, pituitary, thyroid, adrenal, and other major glands and their functions.',
    content: SECTION_2_CONTENT,
    iconName: 'flask',
  },
  {
    id: 'sec3',
    title: 'Microbiology & Musculoskeletal',
    description: 'Bacteria, viruses, and parasites. Anatomy of the skeleton, joints, muscles, and skin structure.',
    content: SECTION_3_CONTENT,
    iconName: 'bone',
  },
  {
    id: 'sec4',
    title: 'Respiratory & Digestive',
    description: 'Anatomy and physiology of the breathing system and the gastrointestinal tract.',
    content: SECTION_4_CONTENT,
    iconName: 'activity',
  },
];
