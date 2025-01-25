# AI Analytics Dashboard Build Prompts

## Core Infrastructure (12 prompts)

1. "Create the initial project structure and database schema for the AI analytics system, focusing on data models for analytics events, agent actions, and performance metrics."

2. "Implement the core data pipeline for collecting analytics events from the website, including real-time event processing and storage."

3. "Build the authentication system for secure API access, including OAuth2 implementation and API key management."

4. "Develop the base API endpoints for data ingestion, query, and agent control with proper validation and rate limiting."

5. "Create the event processing system for real-time analytics data with proper error handling and retry mechanisms."

6. "Implement the data warehouse structure with appropriate indexing and partitioning for optimal query performance."

7. "Build the caching layer for frequently accessed analytics data using Redis, including cache invalidation strategies."

8. "Create the job queue system for handling asynchronous tasks and background processing."

9. "Implement the logging and monitoring infrastructure for system health and performance tracking."

10. "Develop the error handling and recovery system with proper alerting mechanisms."

11. "Create the data backup and restoration system with automated scheduling."

12. "Implement the system health check endpoints and monitoring dashboard."

## Agent Framework (10 prompts)

13. "Create the base agent class with core decision-making capabilities and safety constraints."

14. "Implement the agent communication protocol for inter-agent messaging and coordination."

15. "Build the agent action validation system with budget constraints and safety checks."

16. "Develop the agent learning system for improving decision-making based on performance data."

17. "Create the agent monitoring system for tracking actions and performance metrics."

18. "Implement the agent configuration system for managing rules and constraints."

19. "Build the agent testing framework for validating decisions and actions."

20. "Create the agent rollback system for undoing actions when necessary."

21. "Implement the agent reporting system for tracking effectiveness and ROI."

22. "Develop the agent optimization system for improving performance over time."

## Facebook Agent (8 prompts)

23. "Create the Facebook Marketing API integration with proper authentication and rate limiting."

24. "Implement the Facebook ad campaign management system with budget controls."

25. "Build the Facebook audience targeting system based on website analytics."

26. "Develop the Facebook ad performance tracking and optimization system."

27. "Create the Facebook creative asset management and testing system."

28. "Implement the Facebook campaign budget optimization system."

29. "Build the Facebook A/B testing framework for ad optimization."

30. "Create the Facebook ROI tracking and reporting system."

## Google Agent (8 prompts)

31. "Create the Google Ads API integration with authentication and rate limiting."

32. "Implement the Google Ads campaign management system with budget controls."

33. "Build the Google Ads keyword management and optimization system."

34. "Develop the Google Ads performance tracking and bid optimization system."

35. "Create the Google Ads audience targeting and remarketing system."

36. "Implement the Google Ads budget allocation and optimization system."

37. "Build the Google Ads A/B testing framework for ad optimization."

38. "Create the Google Ads ROI tracking and reporting system."

## Analytics Dashboard (8 prompts)

39. "Create the main analytics dashboard UI with real-time data updates."

40. "Implement the performance metrics visualization system with charts and graphs."

41. "Build the agent control panel for managing AI agent actions and constraints."

42. "Develop the ROI tracking and reporting interface with exportable reports."

43. "Create the anomaly detection and alerting interface."

44. "Implement the budget management and optimization interface."

45. "Build the A/B testing results visualization and analysis interface."

46. "Create the custom report builder interface with saved templates."

## Testing & Security (4 prompts)

47. "Implement comprehensive unit tests for all core components and agent systems."

48. "Create integration tests for API endpoints and data flow validation."

49. "Implement security measures including penetration testing and vulnerability scanning."

50. "Create the deployment pipeline with staging environment and rollback capabilities."

## Implementation Notes

- Each prompt should be used in order as they build upon each other
- Include relevant code snippets and configuration in responses
- Focus on maintainable, production-ready code
- Ensure proper error handling and logging
- Maintain consistent coding style and documentation
- Consider scalability and performance in implementations
- Follow security best practices throughout
- Include tests for all new functionality