export function YandexButton() {
    return (
      <iframe 
        className="-mt-2" 
        style={{
            margin: 0,
            padding: 0,
            // border: 'none', // Убирает границу
            borderRadius: 8,
            height: 40,
            display: 'block', // Убирает лишние отступы у инлайновых элементов
          }}
        srcDoc={`
            <!-- Подключаем SDK Яндекс OAuth -->
            <html style="background: black; margin: 0; padding: 0; align-items: center;">
            <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"></script>
            <div id="buttonContainerId"></div>
            <!-- Код инициализации -->
            <script>
                window.YaAuthSuggest.init(
                {
                client_id: "7fc14a220299421185877883eca63278",
                response_type: "token",
                redirect_uri: "http://localhost:8000/auth/yandex/callback"
                },
                "http://localhost",
                {
                view: "button",
                parentId: "buttonContainerId",
                buttonSize: 's',
                buttonView: 'main',
                buttonTheme: 'light',
                buttonBorderRadius: "6",
                buttonIcon: 'ya',
                }
            )
            .then(({handler}) => handler())
            .then(data => console.log('Сообщение с токеном', data))
            .catch(error => console.log('Обработка ошибки', error))
            </script>
            </html>
        `} 
        // width="100%"
        width="400px"
        height="56px" 
      />
    );
  }