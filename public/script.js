let testRequest = async () => {
    // Делаем запрос к нашему серверу
    const response = await fetch('/api/data');
    const data = await response.json();
    
    document.getElementById('response').innerText = data.message;
}

testRequest();