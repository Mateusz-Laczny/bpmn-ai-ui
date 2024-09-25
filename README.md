This is the frontend part of the application. The backend part can be
found [here](https://github.com/Mateusz-Laczny/bpmn-ai).

# Running locally with Docker

To run the application locally with Docker, Docker must be installed on your system.

To build the image, run:

```bash
docker build -t bpmn-ai-frontend .
```

in the root directory of the repository.
To run the container, run:

```bash
docker run -p 3000:3000 bpmn-ai-frontend
```

The application will be available at `localhost:3000`.
