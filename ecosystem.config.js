module.exports = {
  apps: [{
    name: 'ws',
    script: './server/index.js',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
