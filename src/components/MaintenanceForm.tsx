import { z } from 'zod';
import { useState } from 'react';
import { MaintenanceRecord, Type, Priority, CompletionStatus } from '../types/maintenance';
import { Equipment } from '../types/equipment';

const maintenanceSchema = z.object({
    date: z.string().refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date < new Date(); // Ensure it's a valid past date
    }, {
        message: 'Date must be a valid past date',
    }),
    equipmentId: z.string().min(1, 'Equipment must be selected'), // Validate that equipment must be selected
    type: z.enum([Type.Preventive, Type.Repair, Type.Emergency]),
    technician: z.string().min(2, 'Technician name must be at least 2 characters long'),
    hoursSpent: z.number().positive().max(24, 'Hours spent cannot exceed 24'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    partsReplaced: z.array(z.string()).optional(),
    priority: z.enum([Priority.Low, Priority.Medium, Priority.High]),
    completionStatus: z.enum([CompletionStatus.Complete, CompletionStatus.Incomplete, CompletionStatus.PendingParts]),
});

interface MaintenanceFormProps {
    onAdd: (record: MaintenanceRecord) => void;
    equipmentList: Equipment[]; // Accept the equipment list as a prop
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onAdd, equipmentList }) => {
    const [formData, setFormData] = useState<MaintenanceRecord>({
        id: '',
        date: new Date().toISOString().split('T')[0],
        equipmentId: '',
        type: Type.Preventive,
        technician: '',
        hoursSpent: 0,
        description: '',
        partsReplaced: [],
        priority: Priority.Low,
        completionStatus: CompletionStatus.PendingParts,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(`Name: ${name}, Value: ${value}`); // Log name and value
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePartsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const currentPartsReplaced = formData.partsReplaced || [];
        const newPartsReplaced = [...currentPartsReplaced];
        newPartsReplaced[index] = e.target.value; // Update the specific part
        setFormData((prevData) => ({
            ...prevData,
            partsReplaced: newPartsReplaced,
        }));
    };

    const handleAddPart = () => {
        setFormData((prevData) => ({
            ...prevData,
            partsReplaced: [...(prevData.partsReplaced ?? []), ''], // Add a new empty part field
        }));
    };

    const handleRemovePart = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            partsReplaced: (prevData.partsReplaced ?? []).filter((_, i) => i !== index), // Remove part at the index
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newId = String(Math.floor(100000 + Math.random() * 900000)); // Generate a unique ID
            const formDataWithId = { ...formData, id: newId };
            maintenanceSchema.parse(formDataWithId); // Validate the entire form data
            onAdd(formDataWithId); // Pass the data back to the parent

            // Reset the form
            setFormData({
                id: '',
                date: new Date().toISOString().split('T')[0],
                equipmentId: '',
                type: Type.Preventive,
                technician: '',
                hoursSpent: 0,
                description: '',
                partsReplaced: [],
                priority: Priority.Low,
                completionStatus: CompletionStatus.PendingParts,
            });
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMap: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    errorMap[err.path[0]] = err.message;
                });
                setErrors(errorMap);
            }
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                {/* Equipment Dropdown */}
                <div>
                    <label>Equipment:</label>
                    <select
                        className="mb-3 border p-2 w-full"
                        name="equipmentId"
                        value={formData.equipmentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Equipment</option>
                        {equipmentList.map((equipment) => (
                            <option key={equipment.id} value={equipment.id}>
                                {equipment.name}
                            </option>
                        ))}
                    </select>
                    {errors.equipmentId && <div style={{ color: 'red' }}>{errors.equipmentId}</div>}
                </div>

                {/* Other form fields remain the same */}
                <div>
                    <label>Date:</label>
                    <input
                        className="mb-3 border p-2 w-full"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    {errors.date && <div style={{ color: 'red' }}>{errors.date}</div>}
                </div>

                <div>
                    <label>Type:</label>
                    <select
                        className="mb-3 border p-2 w-full"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value={Type.Preventive}>Preventive</option>
                        <option value={Type.Repair}>Repair</option>
                        <option value={Type.Emergency}>Emergency</option>
                    </select>
                </div>

                <div>
                    <label>Technician:</label>
                    <input
                        className="mb-3 border p-2 w-full"
                        type="text"
                        name="technician"
                        value={formData.technician}
                        onChange={handleChange}
                        required
                    />
                    {errors.technician && <div style={{ color: 'red' }}>{errors.technician}</div>}
                </div>

                <div>
                    <label>Hours Spent:</label>
                    <input
                        className="mb-3 border p-2 w-full"
                        type="number"
                        name="hoursSpent"
                        min={0}
                        max={24}
                        value={formData.hoursSpent}
                        onChange={(e) => setFormData({ ...formData, hoursSpent: Number(e.target.value) })}
                        required
                    />
                    {errors.hoursSpent && <div style={{ color: 'red' }}>{errors.hoursSpent}</div>}
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        className="mb-3 border p-2 w-full"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
                </div>

                <div>
                    <label>Parts Replaced:</label>
                    {formData.partsReplaced!.map((part, index) => (  // Notice the '!' assertion here
                        <div key={index} className="flex mb-3">
                            <input
                                className="border p-2 w-full"
                                type="text"
                                value={part}
                                onChange={(e) => handlePartsChange(e, index)}
                            />
                            <button className="mr-2 p-2 bg-red-500 text-white rounded" type="button" onClick={() => handleRemovePart(index)}>
                                Remove
                            </button>
                        </div>
                    )) || <div>No parts replaced.</div>}
                    <button className="mr-2 p-2 bg-yellow-400 text-white rounded" type="button" onClick={handleAddPart}>
                        Add Part
                    </button>
                </div>

                <div>
                    <label>Priority:</label>
                    <select
                        className="mb-3 border p-2 w-full"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.High}>High</option>
                    </select>
                </div>

                <div>
                    <label>Completion Status:</label>
                    <select
                        className="mb-3 border p-2 w-full"
                        name="completionStatus"
                        value={formData.completionStatus}
                        onChange={handleChange}
                        required
                    >
                        <option value={CompletionStatus.Complete}>Complete</option>
                        <option value={CompletionStatus.Incomplete}>Incomplete</option>
                        <option value={CompletionStatus.PendingParts}>Pending Parts</option>
                    </select>
                </div>

                <button className="mr-2 p-2 bg-green-700 text-white rounded w-full" type="submit">
                    Submit Maintenance Record
                </button>
            </form>
        </div>
    );
};

export default MaintenanceForm;