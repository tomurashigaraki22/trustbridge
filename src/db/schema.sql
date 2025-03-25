CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    country VARCHAR(100),
    status ENUM('active', 'suspended', 'pending', 'blocked') DEFAULT 'pending',
    kyc_status ENUM('none', 'pending', 'verified', 'rejected') DEFAULT 'none',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    login_ip VARCHAR(45),
    btc_balance DECIMAL(18, 8) DEFAULT 0,
    eth_balance DECIMAL(18, 8) DEFAULT 0,
    usdt_balance DECIMAL(18, 8) DEFAULT 0,
    bnb_balance DECIMAL(18, 8) DEFAULT 0,
    xrp_balance DECIMAL(18, 8) DEFAULT 0,
    ada_balance DECIMAL(18, 8) DEFAULT 0,
    doge_balance DECIMAL(18, 8) DEFAULT 0,
    sol_balance DECIMAL(18, 8) DEFAULT 0,
    dot_balance DECIMAL(18, 8) DEFAULT 0,
    matic_balance DECIMAL(18, 8) DEFAULT 0,
    link_balance DECIMAL(18, 8) DEFAULT 0,
    uni_balance DECIMAL(18, 8) DEFAULT 0,
    avax_balance DECIMAL(18, 8) DEFAULT 0,
    ltc_balance DECIMAL(18, 8) DEFAULT 0,
    shib_balance DECIMAL(18, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE account_notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('security', 'transaction', 'kyc', 'system', 'promotion') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

 
CREATE TABLE wallet_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    label VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('deposit', 'withdrawal', 'transfer', 'trade') NOT NULL,
    currency VARCHAR(10) NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    fee DECIMAL(18, 8) DEFAULT 0,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    tx_hash VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    permissions JSON,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE kyc_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type ENUM('passport', 'national_id', 'drivers_license', 'proof_of_address') NOT NULL,
    document_number VARCHAR(100),
    document_url VARCHAR(255),
    document_front_url VARCHAR(255),
    document_document_back_url VARCHAR(255),
    selfie_url VARCHAR(255),
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_status ON kyc_documents(status);