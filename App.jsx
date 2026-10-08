import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "Full Time",
    date: "",
    status: "Applied",
    link: "",
    notes: "",
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState(null);

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  // Save jobs to localStorage
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Add or update job
  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.role ||
      !formData.location ||
      !formData.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      setJobs(
        jobs.map((job) =>
          job.id === editingId
            ? { ...formData, id: editingId }
            : job
        )
      );

      setEditingId(null);
      alert("Job updated successfully!");
    } else {
      const newJob = {
        ...formData,
        id: Date.now(),
      };

      setJobs([...jobs, newJob]);

      alert("Job added successfully!");
    }

    resetForm();
  }

  // Reset form
  function resetForm() {
    setFormData({
      company: "",
      role: "",
      location: "",
      jobType: "Full Time",
      date: "",
      status: "Applied",
      link: "",
      notes: "",
    });
  }

  // Delete job
  function deleteJob(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (confirmDelete) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  }

  // Edit job
  function editJob(job) {
    setFormData({
      company: job.company,
      role: job.role,
      location: job.location,
      jobType: job.jobType,
      date: job.date,
      status: job.status,
      link: job.link,
      notes: job.notes,
    });

    setEditingId(job.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Search and filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Dashboard counts
  const total = jobs.length;

  const applied = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interview = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const selected = jobs.filter(
    (job) => job.status === "Selected"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  return (
    <div className="container">

      <h1>Job Application Tracker</h1>

      <p className="subtitle">
        Track and manage your job applications
      </p>

      {/* Dashboard */}

      <div className="dashboard">

        <div className="card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div className="card">
          <h3>Applied</h3>
          <p>{applied}</p>
        </div>

        <div className="card">
          <h3>Interview</h3>
          <p>{interview}</p>
        </div>

        <div className="card">
          <h3>Selected</h3>
          <p>{selected}</p>
        </div>

        <div className="card">
          <h3>Rejected</h3>
          <p>{rejected}</p>
        </div>

      </div>

      {/* Job Form */}

      <div className="form-container">

        <h2>
          {editingId ? "Edit Job Application" : "Add Job Application"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="company"
            placeholder="Company Name *"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role *"
            value={formData.role}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location *"
            value={formData.location}
            onChange={handleChange}
          />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>

          <input
            type="url"
            name="link"
            placeholder="Job Link"
            value={formData.link}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Job" : "Add Job"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      {/* Search and Filter */}

      <div className="filters">

        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>

      </div>

      {/* Job List */}

      <div className="job-list">

        <h2>My Applications</h2>

        {filteredJobs.length === 0 ? (
          <p className="no-jobs">
            No job applications found.
          </p>
        ) : (
          filteredJobs.map((job) => (

            <div className="job-card" key={job.id}>

              <div>

                <h3>{job.company}</h3>

                <p>
                  <strong>Role:</strong> {job.role}
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>

                <p>
                  <strong>Applied Date:</strong> {job.date}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </p>

                {job.notes && (
                  <p>
                    <strong>Notes:</strong> {job.notes}
                  </p>
                )}

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Job
                  </a>
                )}

              </div>

              <div className="actions">

                <button
                  className="edit"
                  onClick={() => editJob(job)}
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;