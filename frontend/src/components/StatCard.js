const StatCard = ({ title, value, icon: Icon, tone = "leaf" }) => (
  <div className="stat-card">
    <div>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value ?? 0}</p>
    </div>
    {Icon && (
      <div className={`stat-icon tone-${tone}`}>
        <Icon size={20} />
      </div>
    )}
  </div>
);

export default StatCard;

