import express from 'express';
import fs from 'fs'
import cp from 'child_process'

interface Input {
  folder: string;
  keyName: string;
  publicDNS: string;
  projectName: string
}

const app = express();
app.use(express.json())

app.get('/test', async (req, res) => {
  const { folder, keyName, privateKey, publicDNS, projectName } = req.body;
  makeSSHfile({ folder, keyName, projectName, publicDNS }, privateKey, keyName);
  connectServer(projectName)
  res.send('ok')
});

app.listen(8080, () => {
  console.log("Init")
})


const makeSSHfile = (data: Input, privateKey: string, keyName: string) => {

  if(!fs.existsSync(`./${keyName}`)){
    fs.writeFileSync(`${keyName}.pem`, privateKey);
    fs.chmodSync(`./${keyName}.pem`, '400');
  }

  const command = `#!/bin/sh\n
  ssh -tt -o StrictHostKeyChecking=no -i "${data.keyName}.pem" ${data.publicDNS} /bin/bash << EOF\n
  
  if [[ $(which docker) && $(docker --version) ]]; then
    echo "Get version docker"
    docker --version
  else
    echo "Instaling docker"
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo docker run hello-world
  fi
  exit
  EOF`

  if (!fs.existsSync(`./${data.projectName}`)) {
    try {
      fs.writeFileSync(`${data.projectName}.sh`, command);
      fs.chmodSync(`./${data.projectName}.sh`, '0755');
    } catch (err) {
      console.log(err);
    }
  }
}

const connectServer = async (projectName: string) => {
  try {
    const result = cp.execSync(`./${projectName}.sh`);
    console.log(result.toString('utf-8'));
    fs.unlinkSync(`./${projectName}.sh`);
  } catch (err) {
    //@ts-ignore
    console.log(err.output[1].toString('utf-8'))
  }
}