import { z } from 'zod';
import { Equipment, Department, Status } from '../types/equipment';
import { useState } from 'react';

// Equipment validation schema using Zod
const equipmentSchema = z.object({
  id: z.string().min(1, 'ID must be at least 1 character long'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  location: z.string(),
  department: z.enum([Department.Machining, Department.Assembly, Department.Packaging, Department.Shipping]),
  model: z.string(),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, 'Serial Number can only contain alphanumeric characters'),
  installDate: z.string().refine(dateStr => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date < new Date(); // Ensure it's a valid past date
  }, {
    message: 'Install date must be a valid past date',
  }),
  status: z.enum([Status.Operational, Status.Down, Status.Maintenance, Status.Retired]),
});

const EquipmentForm: React.FC<{ onAdd: (equipment: Equipment) => void }> = ({ onAdd }) => {
  const [formData, setFormData] = useState<Equipment>({
    id: '', // ID will be generated on form submission
    name: '',
    location: '',
    department: Department.Machining,
    model: '',
    serialNumber: '',
    installDate: new Date().toISOString().split('T')[0], // Use string format for the date
    status: Status.Operational,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update form data based on input change
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newId = String(Math.floor(100000 + Math.random() * 900000)); // Generate a unique ID
      const formDataWithId = { ...formData, id: newId }; // Add the generated ID

      const parsedFormData = equipmentSchema.parse(formDataWithId); // Validate form data
      onAdd(parsedFormData); // Pass validated data to the onAdd callback

      // Reset form to default values
      setFormData({
        id: '',
        name: '',
        location: '',
        department: Department.Machining,
        model: '',
        serialNumber: '',
        installDate: new Date().toISOString().split('T')[0],
        status: Status.Operational,
      });
      setErrors({}); // Clear errors on successful submission
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errorMap[err.path[0]] = err.message; // Map Zod errors to a format suitable for state
        });
        setErrors(errorMap); // Update state with validation errors
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            className="mb-3 border p-2 w-full"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>
        <div>
          <label>Location:</label>
          <input
            className="mb-3 border p-2 w-full"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          {errors.location && <div style={{ color: 'red' }}>{errors.location}</div>}
        </div>
        <div>
          <label>Department:</label>
          <select
            className="mb-3 border p-2 w-full"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value={Department.Machining}>Machining</option>
            <option value={Department.Assembly}>Assembly</option>
            <option value={Department.Packaging}>Packaging</option>
            <option value={Department.Shipping}>Shipping</option>
          </select>
          {errors.department && <div style={{ color: 'red' }}>{errors.department}</div>}
        </div>
        <div>
          <label>Model:</label>
          <input
            className="mb-3 border p-2 w-full"
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          {errors.model && <div style={{ color: 'red' }}>{errors.model}</div>}
        </div>
        <div>
          <label>Serial Number:</label>
          <input
            className="mb-3 border p-2 w-full"
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
          {errors.serialNumber && <div style={{ color: 'red' }}>{errors.serialNumber}</div>}
        </div>
        <div>
          <label>Install Date:</label>
          <input
            className="mb-3 border p-2 w-full"
            type="date"
            name="installDate"
            value={formData.installDate}
            onChange={handleChange}
            required
          />
          {errors.installDate && <div style={{ color: 'red' }}>{errors.installDate}</div>}
        </div>
        <div>
          <label>Status:</label>
          <select
            className="mb-3 border p-2 w-full"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value={Status.Operational}>Operational</option>
            <option value={Status.Down}>Down</option>
            <option value={Status.Maintenance}>Maintenance</option>
            <option value={Status.Retired}>Retired</option>
          </select>
          {errors.status && <div style={{ color: 'red' }}>{errors.status}</div>}
        </div>
        <button className="mr-2 p-2 bg-green-700 text-white rounded w-full" type="submit">
          Add Equipment
        </button>
      </form>
    </div>
  );
};

export default EquipmentForm;