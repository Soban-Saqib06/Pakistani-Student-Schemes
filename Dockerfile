# STAGE 1: Build and Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY PersonalProject.csproj ./
RUN dotnet restore PersonalProject.csproj

COPY . .

RUN dotnet publish PersonalProject.csproj -c Release -o /app/publish /p:UseAppHost=false

# STAGE 2: Final Lightweight Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "PersonalProject.dll"]
