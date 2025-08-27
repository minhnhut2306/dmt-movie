
export const formatServerName = (serverName) => {
  if (!serverName) return '';

  let formatted = serverName.replace(/^#[^(]*\(/, '').replace(/\)$/, '');

  if (formatted === serverName) {
    formatted = serverName.replace(/^#[^-]*-\s*/, '');

    if (formatted === serverName) {
      formatted = serverName.replace(/^#\w+\s+/, '');
    }
  }

  formatted = formatted.trim();

  if (formatted.toLowerCase().includes('vietsub')) {
    formatted = 'Vietsub';
  } else if (formatted.toLowerCase().includes('lồng tiếng') || formatted.toLowerCase().includes('thuyết minh')) {
    formatted = 'Lồng Tiếng';
  } else if (formatted.toLowerCase().includes('engsub') || formatted.toLowerCase().includes('english')) {
    formatted = 'English Sub';
  } else if (formatted.toLowerCase().includes('raw')) {
    formatted = 'RAW';
  }

  return formatted || 'Server';
};

export const prioritizeServers = (servers) => {
  if (!servers || !Array.isArray(servers)) return [];

  const serverPriority = {
    'Vietsub': 1,
    'Lồng Tiếng': 2,
    'English Sub': 3,
    'RAW': 4,
    'Server': 5
  };

  return servers
    .map(server => ({
      ...server,
      server_name: formatServerName(server.server_name)
    }))
    .sort((a, b) => {
      const priorityA = serverPriority[a.server_name] || 99;
      const priorityB = serverPriority[b.server_name] || 99;
      return priorityA - priorityB;
    });
};

export const getDefaultServerIndex = (servers) => {
  if (!servers || !Array.isArray(servers) || servers.length === 0) return 0;

  const vietsubIndex = servers.findIndex(server =>
    formatServerName(server.server_name) === 'Vietsub'
  );

  return vietsubIndex !== -1 ? vietsubIndex : 0;
};