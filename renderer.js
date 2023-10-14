const func = async () => {
    const response = await window.versions.ping();
    const information = document.getElementById("pong");
    information.innerText = response;
    console.log(response);
};

func();

const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;